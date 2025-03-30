import { ApiProperty } from '@nestjs/swagger';

import { VALIDATION_RULES } from '@/constants';
import { SortOrder } from '@/enums';
import { PaginationQuery } from '@/interfaces';

const { PAGINATION } = VALIDATION_RULES;

/**
 * Data Transfer Object for order query parameters
 * Implements PaginationQuery interface for consistent pagination handling
 */
export class OrderQueryParamsDto implements PaginationQuery {
  @ApiProperty({
    type: Number,
    example: PAGINATION.CURRENT_PAGE.DEFAULT_VALUE,
    required: false,
  })
  page?: number;

  @ApiProperty({
    type: Number,
    example: PAGINATION.ITEMS_PER_PAGE.DEFAULT_VALUE,
    required: false,
  })
  limit?: number;

  @ApiProperty({
    type: String,
    example: 'totalAmount',
    required: false,
  })
  sortBy?: string;

  @ApiProperty({
    type: String,
    example: SortOrder.Asc,
    required: false,
  })
  order?: SortOrder;
}
