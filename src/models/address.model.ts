import { Schema, model, Document, Types } from 'mongoose';

export interface IAddress extends Document {
  user: Types.ObjectId;
  line1: string;
  city: string;
  postalCode: string;
  country: string;
}

const AddressSchema = new Schema<IAddress>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    line1: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

export const Address = model<IAddress>('Address', AddressSchema);
