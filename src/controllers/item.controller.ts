
// src/controllers/item.controller.ts
import { Request, Response, NextFunction } from 'express';
import { Item } from '../models/item.model';

export const getItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const items = await Item.find({ isAvailable: true });
    res.json(items);
    return;
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/items/:id
// @desc    Get item by ID
// @access  Public
export const getItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    res.json(item);
    return;
  } catch (err) {
    next(err);
  }
};
