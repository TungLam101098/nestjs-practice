import { body } from 'express-validator';

import { STRING } from '@constants';

export default [body('name').isLength({ min: STRING.CATEGORY_NAME_MIN_LENGTH })];
