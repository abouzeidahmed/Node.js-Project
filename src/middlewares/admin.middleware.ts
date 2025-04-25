
import jwt from 'jsonwebtoken';
import { Admin } from '../models/admin.model';

const ADMIN_JWT_SECRET = 'another_super_secret_key_789';

export const adminProtect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied' });
    return;
  }

  try {
    const decoded: any = jwt.verify(token, ADMIN_JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      res.status(401).json({ message: 'Admin not found, authorization denied' });
      return;
    }
    (req as any).admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
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

