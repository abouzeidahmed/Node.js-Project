import { Schema, model, Document, Types } from 'mongoose';

interface ICartItem {
  item: Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  customer: Types.ObjectId;
  cartItems: ICartItem[];
}

const CartItemSchema = new Schema<ICartItem>(
  {
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },
    cartItems: [CartItemSchema],
  },
  { timestamps: true }
);

export const Cart = model<ICart>('Cart', CartSchema);
