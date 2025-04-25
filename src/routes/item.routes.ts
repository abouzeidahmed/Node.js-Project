// src/routes/item.routes.ts
import express from 'express';
import { getItems, getItemById } from '../controllers/item.controller';

const router = express.Router();

router.get('/', getItems);
router.get('/:id', getItemById);

export default router;
