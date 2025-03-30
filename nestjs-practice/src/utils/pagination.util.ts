import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import { VALIDATION_RULES } from '@/constants';
import { PaginationQuery, PaginationResponse, Metadata } from '@/interfaces';

const { PAGINATION } = VALIDATION_RULES;

/**
 * Applies pagination parameters to a TypeORM query builder
 *
 * @template T - Type of entity being queried
 * @param queryBuilder - TypeORM SelectQueryBuilder instance
 * @param query - Pagination parameters (page, limit)
 * @returns Object containing applied pagination parameters
 */
export const applyPagination = <T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  query: PaginationQuery,
): {
  page: number;
  limit: number;
} => {
  // Get pagination parameters from query
  const page = Number(query.page) || PAGINATION.CURRENT_PAGE.DEFAULT_VALUE;
  const limit = Number(query.limit) || PAGINATION.ITEMS_PER_PAGE.DEFAULT_VALUE;
  const skip = (page - 1) * limit;

  // Apply pagination to query builder
  queryBuilder.skip(skip).take(limit);

  return {
    page,
    limit,
  };
};

/**
 * Executes a paginated query and returns formatted response
 *
 * @template T - Type of entity being queried
 * @param queryBuilder - TypeORM SelectQueryBuilder instance
 * @param query - Pagination parameters (page, limit)
 * @returns Promise containing paginated data and metadata
 */
export async function paginate<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  query: PaginationQuery,
): Promise<PaginationResponse<T>> {
  // Apply pagination and get parameters
  const { page, limit } = applyPagination(queryBuilder, query);

  // Get total count and data
  const [data, total] = await queryBuilder.getManyAndCount();

  // Create metadata using the pagination parameters
  const metadata: Metadata = {
    page,
    limit,
    total,
    pageCount: Math.ceil(total / limit),
  };

  return {
    data,
    metadata,
  };
}
