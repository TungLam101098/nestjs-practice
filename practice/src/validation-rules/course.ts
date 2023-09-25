import { body } from 'express-validator';

import { STRING } from '@constants';

const courseAddedValidationRules = [
  body().isArray(),
  body('*.name').isLength({ min: STRING.COURSE_NAME_MIN_LENGTH }),
  body('*.category').isLength({ min: STRING.CATEGORY_NAME_MIN_LENGTH }),
  body('*.description').optional().isString(),
];

const courseUpdatedValidationRules = [
  body('name').isLength({ min: STRING.COURSE_NAME_MIN_LENGTH }),
  body('category').isLength({ min: STRING.CATEGORY_NAME_MIN_LENGTH }),
  body('description').optional().isString(),
];

export { courseAddedValidationRules, courseUpdatedValidationRules };
