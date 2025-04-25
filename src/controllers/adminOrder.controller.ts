
import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/order.model';

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email')
      .populate('orderItems.item', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
    return;
  } catch (err) {
    next(err);
  }
};
