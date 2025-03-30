import { ApiProperty } from '@nestjs/swagger';

import { generateOrder } from '@/mocks';

import { OrderResponse } from '../interfaces/order-response.interface';

const { id, userId, totalAmount, status, createdAt } = generateOrder();

/**
 * Data Transfer Object for order response
 * Used for returning order data in API responses
 * Implements OrderResponse interface to ensure type consistency
 */
export class OrderResponseDto implements OrderResponse {
  @ApiProperty({
    example: id,
  })
  id: string;

  @ApiProperty({
    example: userId,
  })
  userId: string;

  @ApiProperty({
    example: totalAmount,
  })
  totalAmount: number;

  @ApiProperty({
    example: status,
  })
  status: string;

  @ApiProperty({
    example: createdAt,
  })
  createdAt: Date;
}
