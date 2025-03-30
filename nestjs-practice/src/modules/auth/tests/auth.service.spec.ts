import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import {
  generateCreateUserDto,
  generateOrderRequest,
  generateUserWithSensitiveData,
  MOCK_AUTH,
  MOCK_ERROR,
  MOCK_USER,
} from '@/mocks';
import { User } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/users.service';
import { isPasswordValid } from '@/utils';

import { AuthService } from '../auth.service';

const { ACCESS_TOKEN } = MOCK_AUTH;

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  // Create mock user object
  const mockUser = generateUserWithSensitiveData();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneUser: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  describe('validateUser', () => {
    // Arrange
    const { email, password } = mockUser;

    it('should return user when credentials are valid', async () => {
      usersService.findOneUser.mockResolvedValue(mockUser);
      (isPasswordValid as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await service.validateUser(email, password);

      // Assert
      expect(result).toEqual(mockUser);
      expect(usersService.findOneUser).toHaveBeenCalledWith({
        condition: { email },
        hasSensitive: true,
      });
      expect(isPasswordValid).toHaveBeenCalledWith(password, mockUser.password);
    });

    it('should return null when user not found', async () => {
      // Arrange
      usersService.findOneUser.mockResolvedValue({} as User);

      // Act
      const result = await service.validateUser(email, password);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      // Arrange
      usersService.findOneUser.mockResolvedValue(mockUser);
      (isPasswordValid as jest.Mock).mockResolvedValue(false);

      // Act
      const result = await service.validateUser(
        mockUser.email,
        'wrongPassword',
      );

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should generate JWT token for authenticated user', () => {
      // Arrange
      const authenticatedUser = generateOrderRequest().user;
      jwtService.sign.mockReturnValue(ACCESS_TOKEN);

      // Act
      const result = service.login(authenticatedUser);

      // Assert
      expect(result).toEqual({ accessToken: ACCESS_TOKEN });
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
    });
  });

  describe('register', () => {
    it('should register new user successfully', async () => {
      // Arrange
      const createUserDto = generateCreateUserDto();
      const expectedResponse = { id: MOCK_USER.ID };
      usersService.create.mockResolvedValue(expectedResponse);

      // Act
      const result = await service.register(createUserDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should propagate errors from users service', async () => {
      // Arrange
      const createUserDto = generateCreateUserDto();
      usersService.create.mockRejectedValue(MOCK_ERROR);

      // Act & Assert
      await expect(service.register(createUserDto)).rejects.toThrow(MOCK_ERROR);
    });
  });
});
