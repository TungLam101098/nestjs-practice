import * as Joi from 'joi';

import { VALIDATION_RULES } from '@/constants';
import { SortOrder } from '@/enums';

const { PAGINATION } = VALIDATION_RULES;
const { CURRENT_PAGE, ITEMS_PER_PAGE } = PAGINATION;

/**
 * Joi validation schema for pagination parameters
 * Defines validation rules for pagination-related query parameters
 */
export const PaginationSchema = Joi.object({
  page: Joi.number()
    .min(CURRENT_PAGE.DEFAULT_VALUE)
    .default(CURRENT_PAGE.DEFAULT_VALUE),
  limit: Joi.number()
    .min(ITEMS_PER_PAGE.MIN_VALUE)
    .max(ITEMS_PER_PAGE.MAX_VALUE)
    .default(ITEMS_PER_PAGE.DEFAULT_VALUE),
  offset: Joi.number(),
  sortBy: Joi.string(),
  order: Joi.string()
    .valid(...Object.values(SortOrder))
    .default(SortOrder.Asc),
});
