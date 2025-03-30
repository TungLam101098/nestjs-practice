/**
 * Enum representing different request parameters
 * Used to identify parameter sources in route handlers and decorators
 */
export enum RequestParameter {
  Body = 'body',
  Query = 'query',
  Param = 'param',
}
