import { Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Review } from '../models/review.model';

// POST /api/reviews
export const createReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { itemId, rating, comment } = req.body;

    // Validate
    if (!itemId || !Types.ObjectId.isValid(itemId)) {
      res.status(400).json({ message: 'Valid itemId is required' });
      return;
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      res
        .status(400)
        .json({ message: 'Rating must be a number between 1 and 5' });
      return;
    }

    const review = await Review.create({
      user: new Types.ObjectId(userId),
      item: new Types.ObjectId(itemId),
      rating,
      comment: comment || '',
    });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

// GET /api/reviews/item/:itemId
export const listReviewsForItem = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId } = req.params;
    if (!Types.ObjectId.isValid(itemId)) {
      res.status(400).json({ message: 'Invalid itemId' });
      return;
    }

    const reviews = await Review.find({ item: itemId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

// GET /api/reviews/mine
export const listMyReviews = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const reviews = await Review.find({ user: userId })
      .populate('item', 'name price')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};
