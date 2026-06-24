import Razorpay from "razorpay";
dotenv.config();
import dotenv from "dotenv"



const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret :process.env.RAZORPAY_KEY_SECRET,
})
   console.log("key id", process.env.RAZORPAY_KEY_ID)
   console.log("key secret", process.env.RAZORPAY_KEY_SECRET)

   
export default razorpay;