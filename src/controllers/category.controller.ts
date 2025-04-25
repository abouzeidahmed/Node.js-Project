import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/category.model';

// GET /api/categories
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await Category.find();
    res.json(categories);
    return;
  } catch (err) {
    next(err);
  }
};

// GET /api/categories/:id
export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.json(category);
    return;
  } catch (err) {
    next(err);
  }
};

// POST /api/categories
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description } = req.body;
    if (!name) {
      res.status(400).json({ message: 'Name is required' });
      return;
    }
    const category = await Category.create({ name, description });
    res.status(201).json(category);
    return;
  } catch (err) {
    // Duplicate key (unique name) will throw here
    next(err);
  }
};

// PUT /api/categories/:id
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    const updated = await category.save();
    res.json(updated);
    return;
  } catch (err) {
    next(err);
  }
};

// DELETE /api/categories/:id
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.json({ message: 'Category deleted' });
    return;
  } catch (err) {
    next(err);
  }
};
