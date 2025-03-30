import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { MOCK_DATE } from '@/mocks';

describe('AppController', () => {
  let appController: AppController;
  let appService: jest.Mocked<AppService>;

  // Reset mock service before each test
  beforeEach(async () => {
    // Create mock AppService
    const mockAppService = {
      healthCheck: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService) as jest.Mocked<AppService>;
  });

  describe('getHealthCheck', () => {
    it('should return health status and timestamp', () => {
      // Arrange
      const { NOW } = MOCK_DATE;
      const mockResponse = {
        status: 'ok',
        timestamp: NOW.toISOString(),
      };
      appService.healthCheck.mockReturnValue(mockResponse);

      // Act
      const result = appController.getHealthCheck();

      // Assert
      expect(result).toEqual(mockResponse);
      expect(appService.healthCheck).toHaveBeenCalled();
    });
  });
});
