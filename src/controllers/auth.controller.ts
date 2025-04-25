
// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import Customer from '../models/customer.model';
import generateToken from '../utils/generateToken';

// @route   POST /api/auth/register
export const registerCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, phoneNumber, address } = req.body;

    // 1) Validate required fields
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email and password are required.' });
      return;
    }

    // 2) Check if customer already exists
    const exists = await Customer.findOne({ email });
    if (exists) {
      res.status(400).json({ message: 'Email already registered.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const customer = await Customer.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
    });

    if (!customer) {
      res.status(400).json({ message: 'Invalid customer data.' });
      return;
    }

    // 5) Respond with user info + token
    res.status(201).json({
      _id: customer.id.toString(),
      name: customer.name,
      email: customer.email,
      token: generateToken(customer.name.toString()),
    });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/auth/login
export const authCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1) Validate required fields
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    // 2) Find the customer
    const customer = await Customer.findOne({ email });
    if (!customer) {
      res.status(400).json({ message: 'Invalid credentials.' });
      return;
    }

    // 3) Compare passwords
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials.' });
      return;
    }

    // 4) Respond with user info + token
    res.json({
      _id: customer.id.toString(),
      name: customer.name,
      email: customer.email,
      token: generateToken(customer.name.toString()),
    });
  } catch (err) {
    next(err);
  }
};
