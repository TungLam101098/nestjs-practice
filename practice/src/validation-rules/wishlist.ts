import { body } from 'express-validator';

export default [body().isArray(), body('*').isString()];
