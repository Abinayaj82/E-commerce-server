 import User from '../models/User.js';
 import HandleError from '../helper/handleError.js';
 import dotenv from 'dotenv';
import { sendToken } from '../helper/jwtToken.js';
import { sendEmail } from '../helper/emailHelper.js';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';


 
 dotenv.config();

// Register a new user
 export const newUser = async (req,res,next)=>{
    const { name , email, password, avatar } = req.body;
    // console.log(req.body);
    if(!name || !email || !password){
        return next(new HandleError("Please enter all fields", 400));
    }
    const myCloud = await cloudinary.uploader.upload(avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });
    

     const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
       
     })
     console.log(user);
  //  const token = user.getjwtToken();
//console.log(token);
   sendToken(user,201,res);
    
}

// Login user
export const loginUser = async (req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return next (new HandleError("Please enter email and password", 400));
}
     const user = await User.findOne({email}).select("+password");
     if(!user){
        return next(new HandleError("Invalid email or password ",401));
     
     }
        const isPasswordMatched = await user.comparePassword(password);
        if(!isPasswordMatched){
            return next (new HandleError("Invalid email or passsword", 401));
        }
        sendToken(user,200,res);
}


// Logout user
export const logoutUser = async (req,res,next)=>{
    const options ={
        expires:new Date(Date.now()),
        httpOnly:true,
    }
    res.status(200).cookie("token",null,options).json({
        success:true,
        message:"Logged out successfully",
    })
}

// forgot password 
 export const forgotPassword = async (req,res,next)=>{
    const { email } = req.body;
   // console.log(email);
   const user = await User.findOne({ email });
   if(!user){
    return next(new HandleError("User not found with this email",404));
   }
   // generate reset token
    const resetToken = user.createResetPasswordToken();
    await user.save({validateBeforeSave:false});
    // create reset password url
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then please ignore it.`;
    //console.log(message);

    try {
        await sendEmail({
            email:user.email,
            subject: "Password  reset request",
            message,

        })
    } catch (error) {
        console.log(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
         await user.save({validateBeforeSave:false});
         return next (new HandleError ("Email not sent", 500));
    }
   res.status(200).json({
        success:true,
        message:"Reset password link sent to your email",
    })
 }

 // reset password
 export const resetPassword = async( req,res,next) =>{
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    console.log(resetPasswordToken);
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpiry: { $gt: Date.now() },
    })
    if(!user){
        return next (new HandleError("Reset password token is invalid or has been expired",400));
    }
    const { password ,confirmPassword} = req.body;
    if(password !== confirmPassword){
        return next (new HandleError("Password does not match",400));
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();
    sendToken(user,200,res);

 }

 //get user details
 export const getUserProfile = async (req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,

    })
 }
// Update user password
export const updatePassword = async (req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");
    const { oldPassword, newPassword,confirmPassword } = req.body;
    const isPasswordMatched = await user.comparePassword(oldPassword);
    if(!isPasswordMatched){
        return next (new HandleError("Old password is incorrect", 400));
    }
    if(newPassword !== confirmPassword){
        return next (new HandleError("Password does not match",400));
    }
    user.password = newPassword;
    await user.save();
    sendToken(user,200,res);
}

// Update user profile
export const updateUserProfile = async (req,res,next) =>{
     const { name, email, avatar } = req.body;
     const  updatedUserDetails = {
         name,
         email,
         avatar }
     if(avatar && avatar !== ""){
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;

        if(imageId){
            await cloudinary.uploader.destroy(imageId);
        }
        const myCloud = await cloudinary.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });
        updatedUserDetails.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }
   const user = await User.findByIdAndUpdate(req.user.id, updatedUserDetails, {
        new: true,
        runValidators: true,
    });
    
    res.status(200).json({
    success:true,
    message:"User profile updated successfully",
    user,
    });
}
// save address
     export const saveAddress = async (req,res,next) =>{
        const { fullName ,phoneNo , address,city , state,pinCode,landmark } =req.body;
        const user = await User.findById(req.user.id);
        user.shippingAddress ={
            fullName,
            phoneNo,
            address,
            city,
            state,
            pinCode,
            landmark,
        
        }
        await user.save();
        res.status(200).json({
            success:true,
            message :"Address saved successfully",
            shippingAddress : user.shippingAddress,
        })
     }


//get all users --admin
export const getAllUsers = async(req,res)=>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users,
    })

}

// get single user -- admin
export const getSingleUser = async(req,res,next)=>{
   const id = req.params.id;
   const user = await User.findById(id);
   if(!user){
    return next (new HandleError("User does not exist",404));
   }
   res.status(200).json({
    success:true,
    user,
   })
}
// update user role -- admin
export const updateUserRole = async( req,res,next) =>{
    const id = req.params.id;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(id, { role }, {
        new: true,
        runValidators: true,
    });
    if(!user){
        return next (new HandleError("User does not exist",404));
    }
    res.status(200).json({
        success:true,
        user,
    })
}

// delete user -- admin
export const deleteUser = async (req,res,next)=>{
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if(!user){
        return next (new HandleError("User does not exist",404));
    }
    res.status(200).json({
        success:true,
        message:"User deleted successfully",
    })
}