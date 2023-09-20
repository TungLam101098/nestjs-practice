import { Router } from 'express';

import AuthController from '@controllers/auth-controller';

const router = Router();
const authInstance = AuthController.getInstance();

router.post('/', authInstance.handleLoginRequest);

export default router;
