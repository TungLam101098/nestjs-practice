import { Router } from 'express';

import AuthController from '@controllers/auth-controller';
import validate from '@middlewares/validator';

import { loginValidationRules } from '@validation-rules';

const router = Router();
const authInstance = AuthController.getInstance();

router.post('/', loginValidationRules, validate, authInstance.handleLoginRequest);

export default router;
