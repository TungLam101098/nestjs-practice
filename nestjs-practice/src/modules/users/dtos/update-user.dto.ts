import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

import { VALIDATION_RULES } from '@/constants';
import { generateUserWithSensitiveData } from '@/mocks';

const { PASSWORD, NAME, PHONE } = VALIDATION_RULES;
const { password, name, phone } = generateUserWithSensitiveData();

/**
 * Joi validation schema for user update operations
 * Defines validation rules for updatable user fields
 */
export const UpdateUserSchema = Joi.object({
  password: Joi.string()
    .min(PASSWORD.MIN_LENGTH)
    .max(PASSWORD.MAX_LENGTH)
    .optional(),
  name: Joi.string().min(NAME.MIN_LENGTH).max(NAME.MAX_LENGTH).optional(),
  phone: Joi.string().min(PHONE.MIN_LENGTH).max(PHONE.MAX_LENGTH).optional(),
});

/**
 * Data Transfer Object for user update operations
 * Contains only the fields that can be modified by users
 */
export class UpdateUserDto {
  @ApiProperty({
    type: String,
    example: password,
    required: false,
  })
  password?: string;

  @ApiProperty({
    type: String,
    example: name,
    required: false,
  })
  name?: string;

  @ApiProperty({
    type: String,
    example: phone,
    required: false,
  })
  phone?: string;
}
