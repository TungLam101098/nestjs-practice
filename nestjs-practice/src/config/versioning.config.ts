import { INestApplication, VersioningType } from '@nestjs/common';

import { ApiConfig } from '@/enums';

/**
 * Configures API versioning for the NestJS application
 */
export const setupVersioning = (app: INestApplication): void => {
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ApiConfig.V1,
    prefix: `${ApiConfig.Prefix}/`,
  });
};
