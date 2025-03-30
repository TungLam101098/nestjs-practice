import { SortOptions } from './sort.interface';

/**
 * Base interface for pagination parameters
 */
export interface PaginationBase {
  page: number;
  limit: number;
}

/**
 * Interface for pagination query parameters that extends SortOptions
 * Makes pagination parameters optional while including sorting capabilities
 */
export interface PaginationQuery extends SortOptions, Partial<PaginationBase> {}

/**
 * Interface for pagination metadata that extends PaginationBase
 * Contains information about the current pagination state
 */
export interface Metadata extends PaginationBase {
  total: number;
  pageCount: number;
}

/**
 * Generic interface for standardized paginated API responses
 * Used to wrap data arrays with pagination metadata for consistent API responses
 */
export interface PaginationResponse<T> {
  data: T[];
  metadata: Metadata;
}
