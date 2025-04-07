import {
  BadRequestException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

import { MESSAGES } from '@/constants';

import { handleError } from '../error.util';

const { EMAIL_ALREADY_EXISTS } = MESSAGES;

describe('Error Utils', () => {
  describe('handleError', () => {
    it('should rethrow HttpException when provided', () => {
      // Arrange
      const httpError = new HttpException('Test error', HttpStatus.BAD_REQUEST);

      // Act & Assert
      expect(() => {
        handleError({ error: httpError, defaultMessage: EMAIL_ALREADY_EXISTS });
      }).toThrow(HttpException);

      expect(() => {
        handleError({ error: httpError, defaultMessage: EMAIL_ALREADY_EXISTS });
      }).toThrow('Test error');
    });

    it('should throw InternalServerErrorException with Error message', () => {
      // Arrange
      const error = new Error('Custom error message');

      // Act & Assert
      expect(() => {
        handleError({ error, defaultMessage: EMAIL_ALREADY_EXISTS });
      }).toThrow(InternalServerErrorException);

      expect(() => {
        handleError({ error, defaultMessage: EMAIL_ALREADY_EXISTS });
      }).toThrow('Custom error message');
    });

    it('should throw InternalServerErrorException with default message for non-Error objects', () => {
      // Arrange
      const error = { message: 'Some error' };

      // Act & Assert
      expect(() => {
        handleError({ error, defaultMessage: EMAIL_ALREADY_EXISTS });
      }).toThrow(InternalServerErrorException);

      expect(() => {
        handleError({ error, defaultMessage: EMAIL_ALREADY_EXISTS });
      }).toThrow(EMAIL_ALREADY_EXISTS);
    });

    it('should use custom exception class when provided', () => {
      // Arrange
      const error = new Error('Custom error');

      // Act & Assert
      expect(() => {
        handleError({
          error,
          defaultMessage: EMAIL_ALREADY_EXISTS,
          ExceptionClass: BadRequestException,
        });
      }).toThrow(BadRequestException);
    });

    it('should handle null or undefined errors', () => {
      // Act & Assert
      expect(() => {
        handleError({ defaultMessage: EMAIL_ALREADY_EXISTS });
      }).toThrow(InternalServerErrorException);
    });
  });
});
