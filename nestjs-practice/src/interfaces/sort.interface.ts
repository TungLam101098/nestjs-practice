import { SortOrder } from '@/enums';

/**
 * Interface defining sorting options for database queries and API endpoints
 * Provides a structure for specifying sorting criteria and direction
 */
export interface SortOptions {
  sortBy?: string;
  order?: SortOrder.Asc | SortOrder.Desc;
}
