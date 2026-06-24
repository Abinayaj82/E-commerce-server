import express from 'express';
import { newProduct, productReviews , viewProductReviews, getAllProductsByAdmin,deleteReview} from '../controllers/Product.js';
import { deleteProduct } from '../controllers/Product.js';
import { getAllProducts } from '../controllers/Product.js';
import { updateProduct } from '../controllers/Product.js';
import { getSingleProduct } from '../controllers/Product.js';
import { authoriseRoles, userAuth } from '../helper/UserAuth.js';

const router = express.Router();

//user routes
router.get('/products', getAllProducts);
router.get('/product/:id', getSingleProduct);
router.put('/reviews', userAuth, authoriseRoles("user"), productReviews);


// admin routes
router.post('/admin/product/new', userAuth,authoriseRoles("admin"), newProduct);
router.delete('/admin/product/:id', userAuth,authoriseRoles("admin"), deleteProduct)
router.put('/admin/product/:id',userAuth,authoriseRoles("admin"), updateProduct);
router.get('/admin/reviews', userAuth,authoriseRoles("admin"), viewProductReviews);
router.get('/admin/products', userAuth,authoriseRoles("admin"), getAllProductsByAdmin);
router.delete('/admin/reviews', userAuth,authoriseRoles("admin"), deleteReview)



export default router;