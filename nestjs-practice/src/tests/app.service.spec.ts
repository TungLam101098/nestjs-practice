import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from '@/app.service';
import { MOCK_DATE } from '@/mocks';
import { getCurrentTimestamp } from '@/utils';

describe('AppService', () => {
  let service: AppService;
  const { NOW } = MOCK_DATE;

  beforeEach(async () => {
    // Create NestJS testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    // Get service instance
    service = module.get<AppService>(AppService);

    // Mock getCurrentTimestamp to return consistent value
    (getCurrentTimestamp as jest.Mock).mockReturnValue(NOW);
  });

  describe('healthCheck', () => {
    it('should return application health status with timestamp', () => {
      // Act
      const result = service.healthCheck();

      // Assert
      expect(result).toEqual({
        status: 'OK',
        timestamp: NOW,
      });
      expect(getCurrentTimestamp).toHaveBeenCalledTimes(1);
    });
  });
});
