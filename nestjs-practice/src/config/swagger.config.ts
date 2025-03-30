import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { SWAGGER_CONFIG } from '@/constants';

/**
 * Configures and sets up Swagger documentation for the NestJS application
 */
export const setupSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle(SWAGGER_CONFIG.TITLE)
    .setDescription(SWAGGER_CONFIG.DESCRIPTION)
    .setVersion(SWAGGER_CONFIG.VERSION)
    .addBearerAuth(
      SWAGGER_CONFIG.BEARER_AUTH.CONFIG,
      SWAGGER_CONFIG.BEARER_AUTH.NAME,
    )
    .addSecurityRequirements(SWAGGER_CONFIG.BEARER_AUTH.NAME)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Custom CSS to hide DTO models from the Swagger UI
  const customCss = `
    .model-container[data-name*="Dto"] {
      display: none;
    }
  `;

  // Remove bearer auth requirement for specific paths (login/register)
  const { LOGIN, REGISTER, HEALTH } = SWAGGER_CONFIG.PUBLIC_PATHS;
  if (document.paths[LOGIN]?.post) {
    document.paths[LOGIN].post.security = [];
  }
  if (document.paths[REGISTER]?.post) {
    document.paths[REGISTER].post.security = [];
  }
  if (document.paths[HEALTH]?.get) {
    document.paths[HEALTH].get.security = [];
  }

  SwaggerModule.setup(SWAGGER_CONFIG.PATH, app, document, {
    customCss,
  });
};
