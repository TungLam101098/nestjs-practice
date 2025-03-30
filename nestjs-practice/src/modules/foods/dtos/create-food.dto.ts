import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

import { MESSAGES, REGEX, VALIDATION_RULES } from '@/constants';
import { generateFood } from '@/mocks';

const { NAME, DESCRIPTION, PRICE } = VALIDATION_RULES;
const { name, description, price, imageUrl } = generateFood();

/**
 * Joi validation schema for food creation
 * Defines validation rules for food-related fields
 */
export const CreateFoodSchema = Joi.object({
  name: Joi.string().min(NAME.MIN_LENGTH).max(NAME.MAX_LENGTH).required(),
  description: Joi.string().max(DESCRIPTION.MAX_LENGTH).required(),
  price: Joi.number().min(PRICE.MIN_VALUE).required(),
  imageUrl: Joi.string()
    .pattern(REGEX.IMAGE_URL)
    .messages({
      'string.pattern.base': MESSAGES.INVALID_IMAGE_URL,
    })
    .required(),
});

/**
 * Data Transfer Object for food creation
 * Defines the structure of data required to create a new food item
 */
export class CreateFoodDto {
  @ApiProperty({
    example: name,
  })
  name: string;

  @ApiProperty({
    example: description,
  })
  description: string;

  @ApiProperty({
    example: price,
  })
  price: number;

  @ApiProperty({
    example: imageUrl,
  })
  imageUrl: string;
}
