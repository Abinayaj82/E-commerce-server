import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ["Fruits", "Vegetables", "Groceries"], required: true },
  price: { type: Number,  default: 0.0},
  originalPrice: { type: Number, default: 0.0 },
  
    image:{
            public_id:{
                type:String,
            },
            url:{
                type:String,
            }
      },
  ratings:{type:Number, default:0},
  numOfReviews:{type:Number, default:0},
  reviews:[
    {
      user:{ type: mongoose.Schema.Types.ObjectId, ref:"User", required:true},
      name: { type: String, required: true },
      avatar: { type: String },
      ratings : { type: Number, required: true},
      comment: { type: String, required: true },
      createdAt:{ type: Date, default: Date.now }
    }
  ],
  description: { type: String, required: [true, "Product description is required"] },
  user:{ type: mongoose.Schema.Types.ObjectId, ref:"User", required:true},
  stock: { type: Number, default: 0 },
  unit: { type: String, default: "kg" }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);