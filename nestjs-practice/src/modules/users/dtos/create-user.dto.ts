import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

import { MESSAGES, REGEX, VALIDATION_RULES } from '@/constants';
import { generateUserWithSensitiveData } from '@/mocks';

const { PASSWORD, NAME, PHONE } = VALIDATION_RULES;
const { INVALID_PASSWORD, REQUIRED_PASSWORD } = MESSAGES;

const { email, password, name, phone } = generateUserWithSensitiveData();

/**
 * Joi validation schema for user creation
 * Defines validation rules for each user property
 */
export const CreateUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(PASSWORD.MIN_LENGTH)
    .max(PASSWORD.MAX_LENGTH)
    .pattern(REGEX.PASSWORD)
    .required()
    .messages({
      'string.pattern.base': INVALID_PASSWORD,
      'string.min': `Password should have a minimum length of ${PASSWORD.MIN_LENGTH}`,
      'string.max': `Password should have a maximum length of ${PASSWORD.MAX_LENGTH}`,
      'string.empty': REQUIRED_PASSWORD,
    }),
  name: Joi.string().min(NAME.MIN_LENGTH).max(NAME.MAX_LENGTH).required(),
  phone: Joi.string().min(PHONE.MIN_LENGTH).max(PHONE.MAX_LENGTH).required(),
});

/**
 * Data Transfer Object for creating a new user
 * Used for validating user registration requests
 * Includes Swagger documentation for API endpoints
 */
export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'Email',
    example: email,
  })
  email: string;

  @ApiProperty({
    type: String,
    description:
      'Password (must contain at least one uppercase letter, one lowercase letter, and one special character)',
    example: password,
  })
  password: string;

  @ApiProperty({
    type: String,
    description: 'Name',
    example: name,
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Phone',
    example: phone,
  })
  phone: string;
}
