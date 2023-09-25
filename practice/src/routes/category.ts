import { Router } from 'express';

import CategoryController from '@controllers/category-controller';
import validate from '@middlewares/validator';

import { categoryValidationRules } from '@validation-rules';

const router = Router();
const categoryInstance = CategoryController.getInstance();

router.post('/', categoryValidationRules, validate, categoryInstance.handleCreateCategoryRequest);

export default router;
