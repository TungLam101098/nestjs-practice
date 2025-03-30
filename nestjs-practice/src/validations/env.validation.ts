import * as Joi from 'joi';

import { PORTS } from '@/constants';
import { Environment } from '@/enums';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(Environment.Development, Environment.Production)
    .required(),
  PORT: Joi.number().default(PORTS.APPLICATION),
  DB_HOST: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
});
