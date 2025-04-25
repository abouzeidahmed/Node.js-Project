import { Request, Response, NextFunction } from 'express';
import { Cart } from '../models/cart.model';
import { Item } from '../models/item.model';

type CartItemBody = { itemId: string; quantity: number };

export const getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customerId = (req as any).customer._id as string;
    let cart = await Cart.findOne({ customer: customerId }).populate('cartItems.item', 'name price');
    if (!cart) {
      res.json({ customer: customerId, cartItems: [] });
      return;
    }
    res.json(cart);
    return;
  } catch (err) {
    next(err);
  }
};

// POST /api/cart        → add an item to cart or update its quantity
export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerId = (req as any).customer._id as string;
    const { itemId, quantity }: CartItemBody = req.body;

    // Validate body
    if (!itemId || typeof quantity !== 'number' || quantity < 1) {
      res.status(400).json({ message: 'itemId and quantity (>=1) are required' });
      return;
    }

    // Ensure the item exists
    const item = await Item.findById(itemId);
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    // Find or create cart
    let cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      cart = new Cart({ customer: customerId, cartItems: [] });
    }

    // Check if item already in cart
    const existingIndex = cart.cartItems.findIndex(ci => ci.item.toString() === itemId);
    if (existingIndex >= 0) {
      // Update quantity
      cart.cartItems[existingIndex].quantity = quantity;
    } else {
      // Add new
      cart.cartItems.push({ item: item._id as any, quantity });
    }

    await cart.save();
    const populated = await cart.populate('cartItems.item', 'name price');
    res.status(200).json(populated);
    return;
  } catch (err) {
    next(err);
  }
};

// PUT /api/cart/:itemId → change quantity of an existing item
export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerId = (req as any).customer._id as string;
    const { itemId } = req.params;
    const { quantity }: { quantity: number } = req.body;

    if (typeof quantity !== 'number' || quantity < 1) {
      res.status(400).json({ message: 'quantity (>=1) is required' });
      return;
    }

    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    const idx = cart.cartItems.findIndex(ci => ci.item.toString() === itemId);
    if (idx < 0) {
      res.status(404).json({ message: 'Item not in cart' });
      return;
    }

    cart.cartItems[idx].quantity = quantity;
    await cart.save();
    const populated = await cart.populate('cartItems.item', 'name price');
    res.json(populated);
    return;
  } catch (err) {
    next(err);
  }
};

// DELETE /api/cart/:itemId → remove a single item
export const removeCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerId = (req as any).customer._id as string;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    cart.cartItems = cart.cartItems.filter(ci => ci.item.toString() !== itemId);
    await cart.save();
    const populated = await cart.populate('cartItems.item', 'name price');
    res.json(populated);
    return;
  } catch (err) {
    next(err);
  }
};

// DELETE /api/cart        → clear entire cart
export const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerId = (req as any).customer._id as string;
    const cart = await Cart.findOne({ customer: customerId });
    if (cart) {
      cart.cartItems = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
    return;
  } catch (err) {
    next(err);
  }
};
