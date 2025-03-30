import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { MESSAGES } from '@/constants';
import { generateUserWithSensitiveData } from '@/mocks';
import { handleError } from '@/utils';

import { AuthService } from '../auth.service';
import { LocalStrategy } from '../passport/local.strategy';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  const mockUser = generateUserWithSensitiveData();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    localStrategy = moduleRef.get<LocalStrategy>(LocalStrategy);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('validate', () => {
    const { email, password } = mockUser;

    it('should return user when credentials are valid', async () => {
      // Arrange
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);

      // Act
      const result = await localStrategy.validate(email, password);

      // Assert
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException when credentials are invalid', async () => {
      // Arrange
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);
      jest.mocked(handleError).mockImplementation(() => {
        throw new BadRequestException(MESSAGES.INVALID_CREDENTIALS);
      });

      // Act & Assert
      await expect(localStrategy.validate(email, password)).rejects.toThrow(
        new BadRequestException(MESSAGES.INVALID_CREDENTIALS),
      );
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
    });
  });
});
