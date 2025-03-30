import { ApiProperty } from '@nestjs/swagger';

import { generateFood } from '@/mocks';

import { FoodResponse } from '../interfaces/food-response.interface';

const { id, name, description, price, imageUrl, createdAt, updatedAt } =
  generateFood();

/**
 * Data Transfer Object for food response
 * Used for returning food data in API responses
 * Implements FoodResponse interface to ensure type consistency
 */
export class FoodResponseDto implements FoodResponse {
  @ApiProperty({
    example: id,
  })
  id: string;

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

  @ApiProperty({
    example: createdAt,
  })
  createdAt: Date;

  @ApiProperty({
    example: updatedAt,
  })
  updatedAt: Date;
}
