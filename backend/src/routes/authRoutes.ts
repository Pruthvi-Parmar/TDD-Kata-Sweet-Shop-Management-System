import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { validateRegistration, handleValidationErrors } from '../middleware/validation';

const router = Router();

router.post('/register', validateRegistration, handleValidationErrors, register);
router.post('/login', login);

export default router;

