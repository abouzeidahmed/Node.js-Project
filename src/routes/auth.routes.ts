// src/routes/auth.routes.ts
import { Router } from 'express';
import { registerCustomer, authCustomer } from '../controllers/auth.controller';

const router = Router();

router.post('/register', registerCustomer);

router.post('/login', authCustomer);

export default router;
