import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import { SearchFields } from '@/interfaces';

/**
 * Applies filters to a TypeORM query builder for case-insensitive search
 *
 * @template T - Type of entity being queried
 * @param queryBuilder - TypeORM SelectQueryBuilder instance
 * @param searchFields - Object containing field-value pairs for filtering
 * @returns Object containing applied filter parameters
 */
export const applyFilters = <T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  searchFields: SearchFields,
): void => {
  Object.entries(searchFields).forEach(([key, value]) => {
    if (value) {
      queryBuilder.andWhere(`entity.${key} ILIKE :${key}`, {
        [key]: `%${value}%`,
      });
    }
  });
};
