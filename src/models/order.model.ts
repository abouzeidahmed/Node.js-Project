
import { Schema, model, Document, Types } from 'mongoose';

// Sub‐document for items inside an order
interface IOrderItem {
  item: Types.ObjectId;
  quantity: number;
  unitPrice: number;
}

export interface IOrder extends Document {
  customer: Types.ObjectId;
  orderDate: Date;
  status: 'Pending' | 'Accepted' | 'Rejected';
  totalPrice: number;
  orderItems: IOrderItem[];
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
  },
  { _id: false }  // prevents Mongoose from creating its own _id for subdocs
);

const OrderSchema = new Schema<IOrder>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    orderDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending'
    },
    totalPrice: { type: Number, required: true },
    orderItems: [OrderItemSchema],
  },
  { timestamps: true }
);

export const Order = model<IOrder>('Order', OrderSchema);
