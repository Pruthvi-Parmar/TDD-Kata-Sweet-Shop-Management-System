import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { registrationRules, loginRules } from '../validators/authValidators';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

router.post('/register', registrationRules, handleValidationErrors, register);
router.post('/login', loginRules, handleValidationErrors, login);

export default router;
