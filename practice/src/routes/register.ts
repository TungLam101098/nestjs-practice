import { Router } from 'express';

import AuthController from '@controllers/auth-controller';
import validate from '@middlewares/validator';

import { registerValidationRules } from '@validation-rules';

const router = Router();
const authInstance = AuthController.getInstance();

router.post('/', registerValidationRules, validate, authInstance.handleRegistrationRequest);

export default router;
