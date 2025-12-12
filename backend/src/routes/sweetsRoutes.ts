import { Router } from 'express';
import { createSweet, getAllSweets, getSweetById, updateSweet, deleteSweet, searchSweets, purchaseSweet, restockSweet } from '../controllers/sweetsController';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { createSweetRules, updateSweetRules } from '../validators/sweetValidators';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

router.get('/', getAllSweets);
router.get('/search', searchSweets);
router.get('/:id', getSweetById);
router.post('/', authenticate, createSweetRules, handleValidationErrors, createSweet);
router.put('/:id', authenticate, updateSweetRules, handleValidationErrors, updateSweet);
router.delete('/:id', authenticate, authorizeAdmin, deleteSweet);
router.post('/:id/purchase', authenticate, purchaseSweet);
router.post('/:id/restock', authenticate, authorizeAdmin, restockSweet);

export default router;
