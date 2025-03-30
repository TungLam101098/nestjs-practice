import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CompositeAuthGuard } from '../guards/composite-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

describe('CompositeAuthGuard', () => {
  let guard: CompositeAuthGuard;
  let jwtAuthGuard: JwtAuthGuard;
  let rolesGuard: RolesGuard;
  let mockContext: jest.Mocked<ExecutionContext>;

  beforeEach(async () => {
    // Create mock guards with proper typing
    jwtAuthGuard = {
      canActivate: jest.fn().mockImplementation(() => Promise.resolve(true)),
    } as unknown as jest.Mocked<JwtAuthGuard>;

    rolesGuard = {
      canActivate: jest.fn().mockImplementation(() => Promise.resolve(true)),
    } as unknown as jest.Mocked<RolesGuard>;

    // Create test module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompositeAuthGuard,
        {
          provide: JwtAuthGuard,
          useValue: jwtAuthGuard,
        },
        {
          provide: RolesGuard,
          useValue: rolesGuard,
        },
      ],
    }).compile();

    // Get guard instance
    guard = module.get<CompositeAuthGuard>(CompositeAuthGuard);

    // Create mock context
    mockContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn(),
    } as unknown as jest.Mocked<ExecutionContext>;
  });

  describe('canActivate', () => {
    it('should return false when JWT authentication fails', async () => {
      // Arrange
      jest
        .spyOn(jwtAuthGuard, 'canActivate')
        .mockImplementation(() => Promise.resolve(false));

      // Act
      const result = await guard.canActivate(mockContext);

      // Assert
      expect(result).toBe(false);
      expect(jwtAuthGuard.canActivate).toHaveBeenCalledWith(mockContext);
      expect(rolesGuard.canActivate).not.toHaveBeenCalled();
    });

    it('should check roles when JWT authentication succeeds', async () => {
      // Arrange
      jest
        .spyOn(jwtAuthGuard, 'canActivate')
        .mockImplementation(() => Promise.resolve(true));
      jest.spyOn(rolesGuard, 'canActivate').mockImplementation(() => true);

      // Act
      const result = await guard.canActivate(mockContext);

      // Assert
      expect(result).toBe(true);
      expect(jwtAuthGuard.canActivate).toHaveBeenCalledWith(mockContext);
      expect(rolesGuard.canActivate).toHaveBeenCalledWith(mockContext);
    });

    it('should return roles guard result when JWT auth passes', async () => {
      // Arrange
      jest
        .spyOn(jwtAuthGuard, 'canActivate')
        .mockImplementation(() => Promise.resolve(true));
      jest.spyOn(rolesGuard, 'canActivate').mockImplementation(() => false);

      // Act
      const result = await guard.canActivate(mockContext);

      // Assert
      expect(result).toBe(false);
      expect(jwtAuthGuard.canActivate).toHaveBeenCalledWith(mockContext);
      expect(rolesGuard.canActivate).toHaveBeenCalledWith(mockContext);
    });
  });
});
