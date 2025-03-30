import { ApiProperty } from '@nestjs/swagger';

import { MetadataDto } from '@/dtos';
import { PaginationResponse } from '@/interfaces';

import { OrderResponseDto } from './order-response.dto';

/**
 * Data Transfer Object for paginated orders response
 * Implements PaginationResponse interface with OrderResponseDto type
 * Used for returning lists of orders with pagination metadata
 */
export class OrdersResponseDto implements PaginationResponse<OrderResponseDto> {
  @ApiProperty({
    description: 'List of orders',
    type: [OrderResponseDto],
  })
  data: OrderResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetadataDto,
  })
  metadata: MetadataDto;
}
