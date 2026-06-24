import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"Username is required"],
            // unique:[true, "Username already exists"],
            trim:true,
            minlength:[3,"Username must be at least 3 characters"],
            maxlength :[30,"Username must be at most 30 characters"]

        },
        email:{
            type:String,
            required:[true,"Email is required"],
            unique:true,
            validator : [validator.isEmail, "please enter a valid email"]
            
        },
        password:{
            type:String,
            required:[true,"Password is required"],
            minLength:[6,"Password must be at least 6 characters"],
            select:false

        },
        role:{
            type:String,
            enum:["user","admin"],
            default:"user"

        },
        resetPasswordToken:String,
        resetPasswordExpiry: Date,

      avatar:{
            public_id:{
                type:String,
            },
            url:{
                type:String,
            }
      },
      shippingAddress : {
        fullName :{ type:String},
        phoneNo :{ type:String},
        address:{ type:String},
        city :{ type:String},
        state:{ type:String},
        pinCode:{ type:String},
        landmark :{ type:String},


      },
    cartItems:[
        {
         product: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Product",
           required: true,
      },
         name: String,
         price: Number,
         image: String,
         quantity:{
             type:Number,
             default:1,
         } ,
         stock: Number,
     }
    ]
},
    {timestamps:true}
);
   userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
}
   )
 userSchema.methods.getjwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_TIME
    })
 }
  userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
  }
  userSchema.methods.createResetPasswordToken = function(){
     const resetToken = crypto.randomBytes(20).toString("hex");
     this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
     this.resetPasswordExpiry = Date.now() + 30 * 60 *1000; // 30 minutes from now
     return resetToken;
  }

    


export default mongoose.model("User",userSchema);
