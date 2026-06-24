import User from '../models/User.js';
import HandleError from '../helper/handleError.js';

// add cart
export const addToCart = async(req,res,next) =>{
    const {product, name, price,image,quantity,stock} =  req.body;

    const user = await User.findById(req.user.id);
     
    if(!user){
        return next(new HandleError("User not found",404))
    }

    const itemExists = user.cartItems.find(
        (item) =>item.product.toString() === product
    )
    if(itemExists){
         user.cartItems = user.cartItems.map((item) =>
      item.product.toString() === product
        ? { ...item.toObject(), quantity }
        : item
);
    }else{
      user.cartItems.push({
      product,
      name,
      price,
      image: Array.isArray(image) ? image[0] : image,
      quantity,
      stock,
    });
    }
    await user.save();
     res.status(200).json({
    success: true,
    cartItems: user.cartItems,
  });
}

// get cart items
 export const getCartItems = async(req,res,next) =>{
    const user = await User.findById(req.user.id);

    if(!user){
        return next(new HandleError("User not found" ,404));

    }
    res.status(200).json({
        success: true,
        cartItems :  user.cartItems,
    })
 }
 // remove cart item

 export const removeCartItems = async(req,res,next) =>{
    const user = await User.findById(req.user.id);

    user.cartItems = user.cartItems.filter(
        (item) => item.product.toString() !== req.params.id
    )
    //console.log(req.params.id)
    await user.save();
    res.status(200).json({
    success: true,
    cartItems: user.cartItems,
})
 }
 // clear cart
 export const clearCart = async(req,res,next)=>{
   const user = await User.findById(req.user.id);
   user.cartItems = [];
   await user.save();
   res.status(200).json({
    success:true,
    cartItems : user.cartItems,
   })
 }

 //update quantity

 export const updateCartQuantity = async (req, res, next) => {
  const { productId, quantity } = req.body;

  const user = await User.findById(req.user.id);
    if (!user) {
    return next(new HandleError("User not found", 404));
   }

  const itemIndex = user.cartItems.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return next(new HandleError("Item not found in cart", 404));
  }

  user.cartItems[itemIndex].quantity = quantity;
 

  await user.save();

  res.status(200).json({
    success: true,
    cartItems: user.cartItems,
  });
};