import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import  ProductRoutes  from './routes/Product.js';
import UserRoutes from './routes/User.js';
import OrderRoutes from './routes/Order.js';
import {v2 as cloudinary} from 'cloudinary';
import errorMiddleware from './middleware/error.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import CartRoutes from './routes/Cart.js';
import PaymentRoutes from './routes/Payment.js';

const app = express();

dotenv.config();
app.use(cors(
    {
    origin: [
      "http://localhost:5173",
      "https://e-commerce-client-97lz.vercel.app",
    ],
    credentials: true,
  }
));
app.use(express.json({limit:"30mb" , extended :true}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());
const PORT = process.env.PORT || 5000;

app.get ('/',(req,res)=>{
    res.send("This is an ecommerce API")
})

app.use('/api/v1', ProductRoutes);
app.use('/api/v1', UserRoutes);
app.use('/api/v1', OrderRoutes);
app.use('/api/v1',CartRoutes);
app.use('/api/v1', PaymentRoutes);

// Configuration for Cloudinary
 cloudinary.config({ 
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
     api_key: process.env.CLOUDINARY_API_KEY, 
     api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });


app.use(errorMiddleware);
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
   .catch(err => console.log(err));


