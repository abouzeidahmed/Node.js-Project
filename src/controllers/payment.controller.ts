import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Types } from 'mongoose';
import { Payment } from '../models/payment.model';
import { Order } from '../models/order.model';

export const createPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerId = req.user!.id;
    const { orderId, paymentMethod, transactionId } = req.body;

    if (!orderId || !Types.ObjectId.isValid(orderId)) {
      res.status(400).json({ message: 'Valid orderId is required' });
      return;
    }
    if (!paymentMethod || !transactionId) {
      res.status(400).json({ message: 'paymentMethod and transactionId are required' });
      return;
    }

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    if (order.customer.toString() !== customerId) {
      res.status(403).json({ message: 'Not authorized for this order' });
      return;
    }
    if (order.status !== 'Pending') {
      res.status(400).json({ message: 'Order already processed' });
      return;
    }

    const amount = order.totalPrice;
    await Payment.create({
      order: order._id,
      customer: new Types.ObjectId(customerId),
      amount,
      paymentMethod,
      transactionId,
      status: 'Completed',
    });

    order.status = 'Accepted';
    await order.save();

    res.status(201).json({ message: 'Payment successful', orderId, amount });
  } catch (err) {
    next(err);
  }
};

export const getMyPayments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerId = req.user!.id;
    const payments = await Payment.find({ customer: customerId })
      .sort({ createdAt: -1 })
      .populate('order', 'totalPrice status')
      .lean();
    res.json(payments);
  } catch (err) {
    next(err);
  }
};

export const getPaymentById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerId = req.user!.id;
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid payment ID' });
      return;
    }

    const payment = await Payment.findById(id)
      .populate('order')
      .populate('customer', 'name email')
      .lean();
    if (!payment) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }
    if (payment.customer.toString() !== customerId) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    res.json(payment);
  } catch (err) {
    next(err);
  }
};
