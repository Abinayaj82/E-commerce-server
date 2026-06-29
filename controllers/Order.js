import Order from '../models/Order.js';
import handleError from "../helper/handleError.js";
import Product from '../models/Product.js';

export const createNewOrder = async (req,res)=>{
   const {shippingAddress, orderItems, paymentInfo, itemPrice, taxPrice,
     shippingPrice, totalPrice} = req.body;
     //console.log("req.user =", req.user);
    //console.log("req.body =", req.body);
     const order = await Order.create({
        shippingAddress,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
     })
     res.status(201).json({
        success: true,
        order,
     })
}
 // get single order details
  export const getSingleOrder = async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user","name email");
    //console.log(order);
    if(!order){
        return next(new handleError("Order not found with this id", 404));
    }
    res.status(200).json({
        success:true,
        order,
    })
  }
  // get all order history of a user
  export const getMyOrders = async(req,res,next)=>{
    const orders = await Order.find({user: req.user._id});
   // console.log(orders);
    res.status(200).json({
        success:true,
        orders: orders || [],
    })
  }
  // get all orders -- admin
export const getAllOrders = async(req,res,next)=>{
    const orders = await Order.find().populate("user","name email");
    if(!orders || orders.length === 0){
        return next(new handleError("No orders found", 404));
    }
    let totalAmount = 0;
    orders.forEach(order=>{
        totalAmount += order.totalPrice;
    })
    res.status(200).json({
        success:true,
        orders,
        totalAmount,
    });
}

// delete order -- admin
export const deleteOrder = async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    
    if(!order){
        return next(new handleError("Order not found with this id", 404));
    }
    if(order.orderStatus !== "Delivered"){
        return next(new handleError("You can only delete delivered orders", 400));
    }
    await order.deleteOne({_id: req.params.id});

    res.status(200).json({
        success:true,
        message:"Order deleted successfully"
    })
}

// admin can update order status and delivery date
 export const updateOrderStatus = async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new handleError("Order not found with this id", 404));
    }
    if(order.orderStatus === "Delivered"){
        return next(new handleError("You have already delivered this order", 400));
    }
      //update stocks
    await Promise.all(order.orderItems.map(async item=>{
        await updateQuantity(item.product, item.quantity);
    }))

    order.orderStatus = req.body.status;
    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }
      await order.save();
   res.status(200).json({
        success:true,
        order,
    })
  
    async function updateQuantity(id, quantity){
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({validateBeforeSave: false});
   }
  
   
 }