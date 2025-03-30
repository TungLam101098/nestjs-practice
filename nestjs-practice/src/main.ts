import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { setupSwagger, setupVersioning } from '@/config';
import { PORTS } from '@/constants';

import { AppModule } from './app.module';
import { CustomLogger } from './config/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || PORTS.APPLICATION;

  // Setup API versioning
  setupVersioning(app);

  // Setup Swagger
  setupSwagger(app);

  // Start the app
  await app.listen(port);
}
bootstrap();
