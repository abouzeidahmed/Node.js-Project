import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Notification } from '../models/notification.model';

export const listNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const notes = await Notification.find({ user: req.user!.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) { next(err); }
};

export const markRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const note = await Notification.findOne({ _id: req.params.id, user: req.user!.id });
    if (!note) { res.status(404).json({ message: 'Not found' }); return; }
    note.read = true;
    await note.save();
    res.json(note);
  } catch (err) { next(err); }
};

