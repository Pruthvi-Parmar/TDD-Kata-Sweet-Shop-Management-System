import { Router } from 'express';
import { createSweet, getAllSweets, getSweetById, updateSweet, deleteSweet } from '../controllers/sweetsController';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getAllSweets);
router.get('/:id', getSweetById);
router.post('/', authenticate, createSweet);
router.put('/:id', authenticate, updateSweet);
router.delete('/:id', authenticate, authorizeAdmin, deleteSweet);

export default router;

