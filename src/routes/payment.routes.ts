import { Router } from 'express';
import {
  createPayment,
  getMyPayments,
  getPaymentById,
} from '../controllers/payment.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', protect, createPayment);
router.get('/my', protect, getMyPayments);
router.get('/:id', protect, getPaymentById);

export default router;
