/**
 * Standard HTTP exception response structure used across the application
 */
export interface HttpExceptionResponse {
  error: string;
  message: string;
}

/**
 * Extended error response that includes HTTP status code
 * Used for standardizing error responses across the application
 */
export interface ErrorResponse extends HttpExceptionResponse {
  status: number;
}
