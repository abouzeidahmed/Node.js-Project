
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/admin.model';

const ADMIN_JWT_SECRET = 'another_super_secret_key_789'; 

// Generate token
const generateAdminToken = (id: string): string =>
  jwt.sign({ id }, ADMIN_JWT_SECRET, { expiresIn: '7d' });

// POST /api/admin/auth/register
export const registerAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, phoneNumber, role } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required' });
      return;
    }

    const exists = await Admin.findOne({ email });
    if (exists) {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      name,
      email,
      password: hashed,
      phoneNumber,
      role: role || 'Admin',
    });

    res.status(201).json({
      _id: admin.id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateAdminToken(admin.name.toString()),
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/auth/login
export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    res.json({
      _id: admin.name.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateAdminToken(admin.name.toString()),
    });
  } catch (err) {
    next(err);
  }
};
