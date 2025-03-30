import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

import { MESSAGES, REGEX, VALIDATION_RULES } from '@/constants';
import { generateFood } from '@/mocks';

import { CreateFoodDto } from './create-food.dto';

const { NAME, DESCRIPTION, PRICE } = VALIDATION_RULES;
const { name, description, price, imageUrl } = generateFood();

/**
 * Validation schema for food updates
 * All fields are optional to allow partial updates
 */
export const UpdateFoodSchema = Joi.object({
  name: Joi.string().min(NAME.MIN_LENGTH).max(NAME.MAX_LENGTH).optional(),
  description: Joi.string().max(DESCRIPTION.MAX_LENGTH).optional(),
  price: Joi.number().min(PRICE.MIN_VALUE).optional(),
  imageUrl: Joi.string()
    .pattern(REGEX.IMAGE_URL)
    .messages({
      'string.pattern.base': MESSAGES.INVALID_IMAGE_URL,
    })
    .optional(),
});

/**
 * Data Transfer Object for updating food items
 * Extends CreateFoodDto as a partial type to make all fields optional
 */
export class UpdateFoodDto extends PartialType(CreateFoodDto) {
  @ApiProperty({
    example: name,
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: description,
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: price,
    required: false,
  })
  price?: number;

  @ApiProperty({
    example: imageUrl,
    required: false,
  })
  imageUrl?: string;
}
