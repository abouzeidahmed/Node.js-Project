import { Router } from 'express';
import { registerAdmin, loginAdmin } from '../controllers/adminAuth.controller';
import { adminProtect } from '../middlewares/admin.middleware';
import { getAllOrders } from '../controllers/adminOrder.controller';

const router = Router();

// Auth
router.post('/auth/register', registerAdmin);
router.post('/auth/login', loginAdmin);

// Admin-only: view all orders
router.get('/orders', adminProtect, getAllOrders);

export default router;
