
import { Schema, model, Document } from 'mongoose';

export interface IItem extends Document {
  name: string;
  description?: string;
  price: number;
  isAvailable: boolean;
}

const ItemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export  const Item = model<IItem>('Item', ItemSchema);
