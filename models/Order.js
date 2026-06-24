import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    shippingAddress: {
        fullName:{
            type:String,
            required:true
        },
       address:{
        type: String,
        required: true
       },
       city:{
        type: String,
        required: true
       },
       state:{
        type: String,
        required: true
       },
       pinCode:{
        type: Number,
        required: true
       },
       landmark:{
        type: String,
    
       },
       phoneNo:{
        type: Number,
        required: true
       }
    },


    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderItems: [
        {
            name:{
                type: String,
                required: true
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            image:{
                type: String,
                required: true
            }
        }
    ],
    orderStatus:{
        type: String,
        required: true,
        default: "Processing"
    },
   paymentInfo: {
    id:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        default :"Pending"    
    },
},
    paidAt:{
        type: Date,
        required: true
    },
    itemPrice:{
        type: Number,
        required: true,
        default:0
    },
    taxPrice:{
        type: Number,
        required: true,
        default:0
    },
    shippingPrice:{
        type: Number,
        required: true,
        default:0
    },
    totalPrice:{
        type: Number,
        required: true,
        default:0
    },
    deliveredAt:{
        type: Date,

   },
   createdAt:{
    type: Date,
    default: Date.now
   }
   

}, { timestamps: true });

export default mongoose.model("Order", orderSchema);