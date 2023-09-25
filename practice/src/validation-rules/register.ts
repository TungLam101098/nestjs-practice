import { body } from 'express-validator';

import { STRING } from '@constants';

export default [
  body('username').isLength({ min: STRING.USERNAME_MIN_LENGTH }),
  body('password').isLength({ min: STRING.PASSWORD_MIN_LENGTH }),
  body('email').isEmail(),
  body('isAdmin').optional().isBoolean(),
];
