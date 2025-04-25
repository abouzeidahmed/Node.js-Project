import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Address } from '../models/address.model';
import { Types } from 'mongoose';

export const listAddresses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const addresses = await Address.find({ user: userId }).sort({ createdAt: -1 });
    res.json(addresses);
  } catch (err) {
    next(err);
  }
};

export const addAddress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { line1, city, postalCode, country } = req.body;

    // Validate required fields
    if (!line1 || !city || !postalCode || !country) {
      res.status(400).json({ message: 'All address fields are required.' });
      return;
    }

    const address = await Address.create({
      user: new Types.ObjectId(userId),
      line1,
      city,
      postalCode,
      country,
    });

    res.status(201).json(address);
  } catch (err) {
    next(err);
  }
};

export const updateAddress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const addressId = req.params.id;

    if (!Types.ObjectId.isValid(addressId)) {
      res.status(400).json({ message: 'Invalid address ID.' });
      return;
    }

    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) {
      res.status(404).json({ message: 'Address not found.' });
      return;
    }

    const { line1, city, postalCode, country } = req.body;
    if (line1 !== undefined) address.line1 = line1;
    if (city !== undefined) address.city = city;
    if (postalCode !== undefined) address.postalCode = postalCode;
    if (country !== undefined) address.country = country;

    await address.save();
    res.json(address);
  } catch (err) {
    next(err);
  }
};

export const deleteAddress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const addressId = req.params.id;

    if (!Types.ObjectId.isValid(addressId)) {
      res.status(400).json({ message: 'Invalid address ID.' });
      return;
    }

    const address = await Address.findOneAndDelete({ _id: addressId, user: userId });
    if (!address) {
      res.status(404).json({ message: 'Address not found.' });
      return;
    }

    res.json({ message: 'Address deleted.' });
  } catch (err) {
    next(err);
  }
};
