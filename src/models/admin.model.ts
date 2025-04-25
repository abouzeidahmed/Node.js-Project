
import { Schema, model, Document } from 'mongoose';

// 1) Define an interface for a single Admin document
export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role?: string;
}

// 2) Create the schema
const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    role: { type: String, default: 'Manager' },
  },
  { timestamps: true }  // adds createdAt and updatedAt
);

// 3) Export the model
export  const Admin = model<IAdmin>('Admin', AdminSchema);
