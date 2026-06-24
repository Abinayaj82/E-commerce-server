import express from 'express'
import { processPayment,verifyPayment} from '../controllers/Payment.js';
import { userAuth} from "../helper/UserAuth.js";

const router = express.Router();

router.post("/payment/process", userAuth , processPayment)
router.post("/payment/verify",  userAuth, verifyPayment);

export default router;