import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

import { VALIDATION_RULES, MESSAGES } from '@/constants';
import { MOCK_FOOD } from '@/mocks';
import {
  CreateCartItemDto,
  CreateCartItemSchema,
} from '@/modules/cart-items/dtos/create-cart-item.dto';

const { CART } = VALIDATION_RULES;
const {
  CART_ITEMS_MUST_BE_ARRAY,
  CART_MIN_ITEMS_REQUIRED,
  CART_ITEMS_REQUIRED,
} = MESSAGES;

/**
 * Validation schema for creating a new cart
 * Ensures the cart contains valid items array
 */
export const CreateCartSchema = Joi.object({
  items: Joi.array()
    .items(CreateCartItemSchema)
    .required()
    .min(CART.MIN_ITEMS)
    .messages({
      'array.base': CART_ITEMS_MUST_BE_ARRAY,
      'array.min': CART_MIN_ITEMS_REQUIRED,
      'any.required': CART_ITEMS_REQUIRED,
    }),
});

/**
 * Data Transfer Object for cart creation
 * Contains an array of cart items
 */
export class CreateCartDto {
  @ApiProperty({
    type: [CreateCartItemDto],
    example: [
      {
        foodId: MOCK_FOOD.ID,
        quantity: 1,
      },
    ],
  })
  items: CreateCartItemDto[];
}
