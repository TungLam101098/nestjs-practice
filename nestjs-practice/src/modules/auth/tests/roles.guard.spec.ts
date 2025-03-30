import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthMetadataKeys } from '@/enums';
import { Role } from '@/modules/users/enums/role.enum';
import { handleError } from '@/utils';

import { RolesGuard } from '../guards/roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;
  let mockContext: jest.Mocked<ExecutionContext>;

  beforeEach(async () => {
    // Create mock reflector
    const mockReflector = {
      getAllAndOverride: jest.fn(),
    };

    // Create mock context
    mockContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn(),
      }),
      switchToWs: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector) as jest.Mocked<Reflector>;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access when no roles are required', () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue([]);

    // Act
    const result = guard.canActivate(mockContext);

    // Assert
    expect(result).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
      AuthMetadataKeys.Roles,
      [mockContext.getHandler(), mockContext.getClass()],
    );
  });

  it('should allow access when user has required role', () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue([Role.Admin]);
    const mockRequest = {
      user: { role: Role.Admin },
    };
    (mockContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(
      mockRequest,
    );

    // Act
    const result = guard.canActivate(mockContext);

    // Assert
    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException when user lacks required role', () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue([Role.Admin]);
    const mockRequest = {
      user: { role: Role.User },
    };
    const errorMessage = `User role ${Role.User} is not authorized`;
    (mockContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(
      mockRequest,
    );
    jest.mocked(handleError).mockImplementation(() => {
      throw new UnauthorizedException(errorMessage);
    });

    // Act & Assert
    expect(() => guard.canActivate(mockContext)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(mockContext)).toThrow(errorMessage);
  });

  it('should handle multiple required roles', () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue([Role.Admin, Role.User]);
    const mockRequest = {
      user: { role: Role.Admin },
    };
    (mockContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(
      mockRequest,
    );

    // Act
    const result = guard.canActivate(mockContext);

    // Assert
    expect(result).toBe(true);
  });
});
