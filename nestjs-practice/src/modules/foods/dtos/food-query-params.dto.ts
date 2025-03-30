import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

import { VALIDATION_RULES } from '@/constants';
import { SortOrder } from '@/enums';
import { PaginationQuery } from '@/interfaces';
import { PaginationSchema } from '@/schemas';

const { PAGINATION } = VALIDATION_RULES;

/**
 * Joi validation schema for food query parameters
 * Extends the base pagination schema with food-specific search fields
 */
export const FoodQueryParamsSchema = PaginationSchema.keys({
  name: Joi.string().optional(),
});

/**
 * Data Transfer Object for food query parameters
 * Implements PaginationQuery interface for consistent pagination handling
 */
export class FoodQueryParamsDto implements PaginationQuery {
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
    example: 'name',
    required: false,
  })
  sortBy?: string;

  @ApiProperty({
    type: String,
    example: SortOrder.Asc,
    required: false,
  })
  order?: SortOrder;

  @ApiProperty({
    type: String,
    example: '',
    required: false,
  })
  name?: string;
}
