import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { generatePayload } from '@/mocks';

import { JwtStrategy } from '../passport/jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get(ConfigService);
  });

  describe('constructor', () => {
    it('should properly initialize with config', () => {
      // Assert
      expect(configService.getOrThrow).toHaveBeenCalledWith('JWT_SECRET');
    });
  });

  describe('validate', () => {
    it('should return user object from jwt payload', () => {
      // Arrange
      const payload = generatePayload();

      // Act
      const result = strategy.validate(payload);

      // Assert
      expect(result).toEqual({
        id: payload.id,
        email: payload.email,
        role: payload.role,
      });
    });

    it('should exclude jwt metadata from returned user object', () => {
      // Arrange
      const payload = generatePayload();

      // Act
      const result = strategy.validate(payload);

      // Assert
      expect(result).not.toHaveProperty('iat');
      expect(result).not.toHaveProperty('exp');
      expect(result).not.toHaveProperty('sub');
    });
  });
});
