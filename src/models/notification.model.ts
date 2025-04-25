import { Schema, model, Document, Types } from 'mongoose';

export interface INotification extends Document {
  user: Types.ObjectId;
  message: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export  const Notification = model<INotification>('Notification', NotificationSchema);
