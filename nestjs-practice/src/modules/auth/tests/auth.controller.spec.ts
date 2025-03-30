import { Test, TestingModule } from '@nestjs/testing';

import { AuthenticatedRequest } from '@/interfaces';
import {
  generateCreateUserDto,
  generateOrderRequest,
  MOCK_AUTH,
  MOCK_ERROR,
} from '@/mocks';

import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

const { ACCESS_TOKEN } = MOCK_AUTH;

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  // Mock user object
  const mockUser = generateOrderRequest().user;

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn(),
      register: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService) as jest.Mocked<AuthService>;
  });

  describe('handleLogin', () => {
    it('should return access token on successful login', () => {
      // Arrange
      const mockRequest = {
        user: mockUser,
      } as AuthenticatedRequest;

      service.login.mockReturnValue({ accessToken: ACCESS_TOKEN });

      // Act
      const result = controller.handleLogin(mockRequest);

      // Assert
      expect(result).toEqual({ accessToken: ACCESS_TOKEN });
      expect(service.login).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const createUserDto = generateCreateUserDto();

      const expectedResponse = { id: mockUser.id };
      service.register.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.register(createUserDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(service.register).toHaveBeenCalledWith(createUserDto);
    });

    it('should propagate service errors', async () => {
      // Arrange
      const createUserDto = generateCreateUserDto();
      service.register.mockRejectedValue(MOCK_ERROR);

      // Act & Assert
      await expect(controller.register(createUserDto)).rejects.toThrow(
        MOCK_ERROR,
      );
      expect(service.register).toHaveBeenCalledWith(createUserDto);
    });
  });
});
