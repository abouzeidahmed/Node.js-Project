import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import Customer from '../models/customer.model';
import * as bcrypt from 'bcryptjs';


export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await Customer.findById(req.user!.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await Customer.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const { name, email, password, phoneNumber, address } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (password) {
      user.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
    }
    await user.save();
    res.json({ message: 'Profile updated' });
  } catch (err) {
    next(err);
  }
};
