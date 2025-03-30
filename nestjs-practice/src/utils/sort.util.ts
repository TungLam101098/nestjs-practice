import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import { SortOrder } from '@/enums';
import { SortOptions } from '@/interfaces';

/**
 * Applies sorting parameters to a TypeORM query builder
 *
 * @template T - Type of entity being queried
 * @param queryBuilder - TypeORM SelectQueryBuilder instance
 * @param sortOptions - Sorting configuration (sortBy field and order direction)
 * @returns Applied sort parameters for reference
 */
export const applySort = <T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  sortOptions: SortOptions,
): void => {
  const order: string = sortOptions.order || SortOrder.Asc;
  const orderValue = order.toUpperCase() as 'ASC' | 'DESC';

  queryBuilder.orderBy(`entity.${sortOptions.sortBy}`, orderValue);
};
