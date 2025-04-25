import { Router } from 'express';
import { getDashboard } from '../controllers/report.controller';
import { adminProtect } from '../middlewares/admin.middleware';

const router = Router();
router.get('/dashboard', adminProtect, getDashboard);

export default router;
