import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/admin.model';
import { Order } from '../models/order.model';
import { Payment } from '../models/payment.model';

const JWT_SECRET = 'yourSuperSecretKey123';
const JWT_EXPIRES = '7d';

// Register a new admin
export const registerAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, phoneNumber, role } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email and password are required.' });
      return;
    }
    if (await Admin.findOne({ email })) {
      res.status(400).json({ message: 'Email already registered.' });
      return;
    }
    const hash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, password: hash, phoneNumber, role });
    const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.status(201).json({ _id: admin._id, name, email, role, token });
  } catch (err) {
    next(err);
  }
};

// Login admin
export const loginAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }
    const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ _id: admin._id, name: admin.name, email, role: admin.role, token });
  } catch (err) {
    next(err);
  }
};

// List all orders (admin)
export const listAllOrders = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email')
      .populate('orderItems.item', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// Update order status (admin)
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found.' });
      return;
    }
    order.status = req.body.status;
    await order.save();
    res.json({ message: 'Order status updated.', order });
  } catch (err) {
    next(err);
  }
};

// Dashboard data (admin)
export const getDashboard = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalOrders = await Order.countDocuments();
    const revAgg = await Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
    const totalRevenue = revAgg[0]?.total || 0;
    res.json({ totalOrders, totalRevenue });
  } catch (err) {
    next(err);
  }
};
