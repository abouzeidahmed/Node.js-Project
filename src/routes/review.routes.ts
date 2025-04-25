import { Router } from 'express';
import {
  createReview,
  listReviewsForItem,
  listMyReviews,
} from '../controllers/review.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Create a review (authenticated)
router.post('/', protect, createReview);

// List reviews for a specific item (public)
router.get('/item/:itemId', listReviewsForItem);

// List my reviews (authenticated)
router.get('/mine', protect, listMyReviews);

export default router;
