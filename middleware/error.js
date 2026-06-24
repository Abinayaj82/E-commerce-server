//import HandleError from "../helper/handleError.js";
export default (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

 // duplicate key error
 //if(err.code === 11000){
  //   const message = `This ${Object.keys(err.keyValue)} already exists.`;
  //   err = new HandleError(message, 400);
//}

    res.status(err.statusCode).json({
        success:false,
        message: err.message,
    })
}