import express from 'express';
import {authoriseRoles, userAuth} from '../helper/UserAuth.js';
import {createNewOrder, getSingleOrder, getMyOrders, getAllOrders,deleteOrder,updateOrderStatus} from '../controllers/Order.js';

const router = express.Router();
router.post('/order/new', userAuth, createNewOrder);
router.get('/order/:id', userAuth, getSingleOrder);
router.get('/orders/user', userAuth , getMyOrders);



// admin routes
router.get('/admin/orders', userAuth, authoriseRoles("admin"), getAllOrders);
router.delete('/admin/order/:id', userAuth, authoriseRoles("admin"), deleteOrder);
router.put('/admin/order/:id', userAuth, authoriseRoles("admin"), updateOrderStatus);
export default router;