import * as bcrypt from 'bcrypt';

import { hashPassword, isPasswordValid } from '../password.util';

jest.mock('bcrypt');

describe('Password Utils', () => {
  const mockSalt = '$2b$10$abcdefghijklmnopqrstuv';
  const mockHash = '$2b$10$abcdefghijklmnopqrstuv.xyz123456789';
  const plainTextPassword = 'TestPassword123';

  // Reset mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      // Arrange
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

      // Act
      const result = await hashPassword(plainTextPassword);

      // Assert
      expect(result).toBe(mockHash);
      expect(bcrypt.genSalt).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledWith(plainTextPassword, mockSalt);
    });

    it('should throw error when hashing fails', async () => {
      // Arrange
      const error = new Error('Hashing failed');
      (bcrypt.genSalt as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(hashPassword(plainTextPassword)).rejects.toThrow(
        'Hashing failed',
      );
      expect(bcrypt.genSalt).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });

  describe('isPasswordValid', () => {
    it('should return true for matching passwords', async () => {
      // Arrange
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await isPasswordValid(plainTextPassword, mockHash);

      // Assert
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(plainTextPassword, mockHash);
    });

    it('should return false for non-matching passwords', async () => {
      // Arrange
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act
      const result = await isPasswordValid(plainTextPassword, mockHash);

      // Assert
      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(plainTextPassword, mockHash);
    });
  });
});
