import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';

import { MESSAGES } from '@/constants';
import { AuthMetadataKeys, AuthStrategies } from '@/enums';
import { MOCK_ERROR } from '@/mocks';
import { handleError } from '@/utils';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: jest.Mocked<Reflector>;

  const mockRequest = {
    headers: {},
    get: jest.fn(),
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  const mockHttpContext = {
    getRequest: jest.fn().mockReturnValue(mockRequest),
    getResponse: jest.fn().mockReturnValue(mockResponse),
  };

  const mockExecutionContext: jest.Mocked<ExecutionContext> = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
    getType: jest.fn(),
    switchToRpc: jest.fn(),
    switchToHttp: jest.fn().mockReturnValue(mockHttpContext),
    switchToWs: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    reflector = module.get<Reflector>(Reflector) as jest.Mocked<Reflector>;
  });

  describe('canActivate', () => {
    it('should return true for public routes', async () => {
      // Arrange
      reflector.getAllAndOverride.mockReturnValue(true);

      // Act
      const result = await guard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
        AuthMetadataKeys.IsPublic,
        [mockExecutionContext.getHandler(), mockExecutionContext.getClass()],
      );
    });

    it('should call parent canActivate for protected routes', async () => {
      // Arrange
      reflector.getAllAndOverride.mockReturnValue(false);
      const superCanActivate = jest
        .spyOn(AuthGuard(AuthStrategies.Jwt).prototype, 'canActivate')
        .mockResolvedValue(true);

      // Act
      await guard.canActivate(mockExecutionContext);

      // Assert
      expect(superCanActivate).toHaveBeenCalledWith(mockExecutionContext);
    });
  });

  describe('handleRequest', () => {
    it('should return user when authentication succeeds', () => {
      // Arrange
      const mockUser = { id: '123', email: 'test@example.com' };

      // Act
      const result = guard.handleRequest(null, mockUser);

      // Assert
      expect(result).toBe(mockUser);
    });

    it('should throw UnauthorizedException when error occurs', () => {
      // Arrange
      jest.mocked(handleError).mockImplementation(() => {
        throw new UnauthorizedException(MESSAGES.MISSING_TOKEN);
      });

      // Act & Assert
      expect(() => guard.handleRequest(MOCK_ERROR, null)).toThrow(
        MESSAGES.MISSING_TOKEN,
      );
    });

    it('should throw UnauthorizedException when user is null', () => {
      // Act & Assert
      expect(() => guard.handleRequest(null, null)).toThrow(
        MESSAGES.MISSING_TOKEN,
      );
    });
  });
});
