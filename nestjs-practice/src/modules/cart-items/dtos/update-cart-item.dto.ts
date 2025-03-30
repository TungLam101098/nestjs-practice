import * as Joi from 'joi';

import { VALIDATION_RULES } from '@/constants';

const { QUANTITY } = VALIDATION_RULES;

/**
 * Validation schema for updating cart items
 * Ensures quantity meets minimum value requirement
 */
export const UpdateCartItemSchema = Joi.object({
  quantity: Joi.number()
    .min(QUANTITY.MIN_VALUE)
    .max(QUANTITY.MAX_VALUE)
    .required(),
});

/**
 * Data Transfer Object for updating cart items
 * Contains the new quantity of a cart item
 */
export class UpdateCartItemDto {
  quantity: number;
}
