import  HandleError  from "./handleError.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
    // Check cookie first, then Authorization header (for cross-origin deployments)
    let token = req.cookies.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new HandleError("Please login to access this resource", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
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
