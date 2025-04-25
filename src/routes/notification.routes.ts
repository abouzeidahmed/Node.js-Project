import { Router } from 'express';
import {
  listNotifications,
  markRead,
} from '../controllers/notification.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();
router.get('/', protect, listNotifications);
router.put('/:id/read', protect, markRead);

export default router;
