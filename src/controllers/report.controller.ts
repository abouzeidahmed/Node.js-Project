
import { Response, NextFunction } from 'express';
import { Order } from '../models/order.model';
import { Payment } from '../models/payment.model';

export const getDashboard = async (_req: any, res: Response, next: NextFunction) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenueAgg = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;
    res.json({ totalOrders, totalRevenue });
  } catch (err) { next(err); }
};
