import { ApiConfig } from '@/enums/api-config.enum';

/**
 * Contains configuration settings for API documentation using Swagger/OpenAPI
 * This constant is used to set up consistent API documentation across the application
 */
export const SWAGGER_CONFIG = {
  TITLE: 'Food Ordering API',
  DESCRIPTION: `
  Food Ordering System API Documentation

  This API provides endpoints for managing food orders, shopping carts, and user accounts:
  - User authentication and authorization
  - Shopping cart management
  - Food menu and categories
  - Order processing and tracking
  - User profile management

  For protected endpoints, please authenticate using JWT token (without Bearer prefix).
  `,
  VERSION: ApiConfig.V1,
  PATH: 'api-doc',
  BEARER_AUTH: {
    NAME: 'JWT-auth',
    CONFIG: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description:
        'Enter JWT token without Bearer prefix. Example: eyJhbGciOiJIUzI1NiIs...',
      in: 'header',
    } as const,
  },
  PUBLIC_PATHS: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    HEALTH: '/api/v1/health',
  },
};
