import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';
import { IsPublicRoute } from './decorators';
import { MOCK_DATE } from './mocks';

@ApiTags('Health Check')
@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @IsPublicRoute()
  @ApiOperation({ summary: 'Get application health status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Application is healthy',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'OK',
        },
        timestamp: {
          type: 'timestamp',
          example: MOCK_DATE.NOW,
        },
      },
    },
  })
  getHealthCheck(): { status: string; timestamp: string } {
    return this.appService.healthCheck();
  }
}
