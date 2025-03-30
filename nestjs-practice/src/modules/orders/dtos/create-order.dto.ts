import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

import { MOCK_CART } from '@/mocks';

/**
 * Validation schema for order creation
 * Ensures the request contains required cart items
 */
export const CreateOrderSchema = Joi.object({
  cartItemIds: Joi.array().items(Joi.string()).required(),
});

/**
 * Data Transfer Object for creating new orders
 * Contains only the fields required for order creation
 */
export class CreateOrderDto {
  @ApiProperty({
    example: [MOCK_CART.CART_ITEM_ID],
  })
  cartItemIds: string[];
}
