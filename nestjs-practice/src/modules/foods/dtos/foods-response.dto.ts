import { ApiProperty } from '@nestjs/swagger';

import { MetadataDto } from '@/dtos';
import { PaginationResponse } from '@/interfaces';

import { FoodResponseDto } from './food-response.dto';

/**
 * Data Transfer Object for paginated foods response
 * Implements PaginationResponse interface with FoodResponseDto type
 * Used for returning lists of foods with pagination metadata
 */
export class FoodsResponseDto implements PaginationResponse<FoodResponseDto> {
  @ApiProperty({
    description: 'List of foods',
    type: [FoodResponseDto],
  })
  data: FoodResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetadataDto,
  })
  metadata: MetadataDto;
}
