
// src/routes/order.routes.ts
import { Router } from 'express';
import { placeOrder, getMyOrders } from '../controllers/order.controller';

const router = Router();

router.post('/', placeOrder);
router.get('/myorders', getMyOrders);

export default router;
