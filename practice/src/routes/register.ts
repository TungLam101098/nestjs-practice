import { Router } from 'express';

const router = Router();

// TODO: Handle register API
router.post('/', (request, response) => {
  response.end('Register successfully');
});

export default router;
