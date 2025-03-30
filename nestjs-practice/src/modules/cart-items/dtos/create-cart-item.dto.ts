import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

import { MESSAGES, VALIDATION_RULES } from '@/constants';
import { MOCK_FOOD } from '@/mocks';

const { QUANTITY } = VALIDATION_RULES;
const { REQUIRED_FOOD_ID, REQUIRED_QUANTITY } = MESSAGES;

/**
 * Validation schema for creating cart items
 * Ensures each cart item has a valid food ID and quantity
 */
export const CreateCartItemSchema = Joi.object({
  foodId: Joi.string().uuid().required().messages({
    'string.empty': REQUIRED_FOOD_ID,
    'any.required': REQUIRED_FOOD_ID,
  }),
  quantity: Joi.number()
    .required()
    .min(QUANTITY.MIN_VALUE)
    .max(QUANTITY.MAX_VALUE)
    .messages({
      'number.min': `Quantity must be at least ${QUANTITY.MIN_VALUE}`,
      'number.max': `Quantity must be at most ${QUANTITY.MAX_VALUE}`,
      'any.required': REQUIRED_QUANTITY,
    }),
});

/**
 * Data Transfer Object for cart item creation
 * Contains the food ID and quantity of a cart item
 */
export class CreateCartItemDto {
  @ApiProperty({
    example: MOCK_FOOD.ID,
  })
  foodId: string;

  @ApiProperty({
    example: 1,
  })
  quantity: number;
}
