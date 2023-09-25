import { body } from 'express-validator';

import { STRING } from '@constants';

export default [
  body().isArray(),
  body('*.name').isLength({ min: STRING.COURSE_NAME_MIN_LENGTH }),
  body('*.category').isLength({ min: STRING.CATEGORY_NAME_MIN_LENGTH }),
  body('*.description').optional().isString(),
];
