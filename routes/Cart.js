import express from 'express';
import { addToCart, getCartItems, removeCartItems, updateCartQuantity,clearCart } from '../controllers/Cart.js';
import { userAuth } from '../helper/UserAuth.js';

const router = express.Router()

router.post('/cart/add', userAuth, addToCart);
router.get('/cart/getItems' , userAuth, getCartItems);
router.delete('/cart/delete/:id' , userAuth, removeCartItems);
router.put('/cart/update' , userAuth, updateCartQuantity);
router.delete('/cart/clear', userAuth, clearCart)



export default router;
