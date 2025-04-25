import { Router } from 'express';
import {
  listAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/address.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// GET    /api/addresses       → List all addresses for the logged-in user
// POST   /api/addresses       → Add a new address
// PUT    /api/addresses/:id   → Update an existing address
// DELETE /api/addresses/:id   → Delete an address
router.get('/', protect, listAddresses);
router.post('/', protect, addAddress);
router.put('/:id', protect, updateAddress);
router.delete('/:id', protect, deleteAddress);

export default router;
