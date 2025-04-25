// src/controllers/order.controller.ts
import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/order.model';
import { Item } from '../models/item.model';

// POST /api/orders    → place a new order
export const placeOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerId = (req as any).customer._id;
    const { orderItems } = req.body; // expect [{ itemId, quantity }]

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      res.status(400).json({ message: 'orderItems must be a non-empty array' });
      return;
    }

    // Build orderItems with unitPrice and calculate total
    let totalPrice = 0;
    const itemsToSave = await Promise.all(
      orderItems.map(async (oi: { itemId: string; quantity: number }) => {
        const item = await Item.findById(oi.itemId);
        if (!item) throw new Error(`Item not found: ${oi.itemId}`);
        const unitPrice = item.price;
        totalPrice += unitPrice * oi.quantity;
        return {
          item: item._id,
          quantity: oi.quantity,
          unitPrice,
        };
      })
    );

    // Create order
    const order = await Order.create({
      customer: customerId,
      orderItems: itemsToSave,
      totalPrice,
    });

    res.status(201).json(order);
    return;
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/myorders   → get logged-in customer's orders
export const getMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerId = (req as any).customer._id;
    const orders = await Order.find({ customer: customerId }).sort({ createdAt: -1 });
    res.json(orders);
    return;
  } catch (err) {
    next(err);
  }
};
