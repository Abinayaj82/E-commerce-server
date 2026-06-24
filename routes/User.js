import express from 'express';
import { logoutUser, newUser, updateUserRole,deleteUser } from '../controllers/User.js';
import { loginUser } from '../controllers/User.js';
import { forgotPassword } from '../controllers/User.js';
import { resetPassword } from '../controllers/User.js';
import { getUserProfile } from '../controllers/User.js';
import { userAuth } from '../helper/UserAuth.js';
import { updatePassword } from '../controllers/User.js';
import { updateUserProfile } from '../controllers/User.js';
import { getAllUsers } from '../controllers/User.js';
import { getSingleUser } from '../controllers/User.js';
import { authoriseRoles } from '../helper/UserAuth.js';
import { saveAddress } from "../controllers/User.js";

const router = express.Router();

router.post('/user/new', newUser);
router.post('/user/login',loginUser);
router.get('/user/logout',logoutUser)
router.post('/user/forgot-password',forgotPassword);
router.post('/user/reset-password/:token',resetPassword);
router.get('/user/profile', userAuth, getUserProfile);
router.put('/user/update-password', userAuth, updatePassword);
router.put('/user/update-profile', userAuth, updateUserProfile);
router.post('/user/saveAddress' , userAuth , saveAddress);

// adminroutes
router.get('/admin/users', userAuth,authoriseRoles("admin"), getAllUsers);
router.get('/admin/user/:id', userAuth,authoriseRoles("admin"), getSingleUser);
router.put('/admin/user/:id', userAuth,authoriseRoles("admin"), updateUserRole);
router.delete('/admin/user/:id', userAuth,authoriseRoles("admin"), deleteUser);
export default router;