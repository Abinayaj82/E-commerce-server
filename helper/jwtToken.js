
import dotenv from 'dotenv';
//import user from '../models/User.js';

dotenv.config();

export const sendToken = (user, statusCode , res)=>{
       const token = user.getjwtToken();
       const options ={
        expires:new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        }
         res.status(statusCode).cookie('token', token, options).json({
            success:true,
            token,
            user
         })
}