import { ApiProperty } from '@nestjs/swagger';

import { VALIDATION_RULES } from '@/constants';
import { Metadata } from '@/interfaces';

const { PAGINATION } = VALIDATION_RULES;

/**
 * Data Transfer Object for pagination metadata
 * Used to standardize pagination response data
 */
export class MetadataDto implements Metadata {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  total: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  pageCount: number;

  @ApiProperty({
    type: Number,
    example: PAGINATION.CURRENT_PAGE.DEFAULT_VALUE,
  })
  page: number;

  @ApiProperty({
    type: Number,
    example: PAGINATION.ITEMS_PER_PAGE.DEFAULT_VALUE,
  })
  limit: number;
}
