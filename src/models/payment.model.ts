import { Schema, model, Document, Types } from 'mongoose';

export interface IPayment extends Document {
  order: Types.ObjectId;
  customer: Types.ObjectId;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: 'Completed' | 'Failed';
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String, required: true },
    status: { type: String, enum: ['Completed', 'Failed'], required: true },
  },
  { timestamps: true }
);

export  const Payment = model<IPayment>('Payment', PaymentSchema);
