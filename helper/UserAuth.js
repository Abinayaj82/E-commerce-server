import  HandleError  from "./handleError.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
    const { token } = req.cookies;
//console.log(token);
    if (!token) {
        return next(new HandleError("Please login to access this resource", 401));
    }
   const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  // console.log(decodedData);
    req.user = await User.findById (decodedData.id);
    next();



}
// Authorization for roles
// eg : [ "admin", "user", "moderator","superadmin"] ]
 export const authoriseRoles = (...roles) =>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new HandleError(`Role: ${req.user.role} is not allowed to access this resource`,403));
        }
        next();
 }
}
