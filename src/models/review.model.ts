import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  user: Types.ObjectId;
  item: Types.ObjectId;
  rating: number;
  comment: string;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export const Review = model<IReview>('Review', ReviewSchema);
