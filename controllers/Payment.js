import razorpay from '../utils/razorpay.js';
import crypto from "crypto";

export const processPayment = async(req,res,next)=>{
   try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`, 
    };

    const order = await razorpay.orders.create(options);

   // console.log("Razorpay order created:", order);

    res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID, // 
    });

  } catch (err) {
    // console.error("Razorpay error:", err); 
    next(err);
  }
}



export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // create expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    res.status(200).json({ success: true, message: "Payment verified" });
  } catch (err) {
    next(err);
  }
};