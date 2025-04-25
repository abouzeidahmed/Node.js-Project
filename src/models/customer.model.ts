import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
export default Customer;
