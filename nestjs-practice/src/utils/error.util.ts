import { HttpException, InternalServerErrorException } from '@nestjs/common';

import { ErrorResponse, HttpExceptionResponse } from '@/interfaces';

/**
 * Handles application errors by either rethrowing HTTP exceptions or wrapping unknown errors
 *
 * @param options.error - Optional caught error
 * @param options.defaultMessage - Default message if error is not an Error instance
 * @param options.CustomException - Optional custom exception class (defaults to InternalServerErrorException)
 * @throws HttpException Always throws an exception
 */
export const handleError = ({
  error,
  defaultMessage,
  CustomException = InternalServerErrorException,
}: {
  error?: unknown;
  defaultMessage: string;
  CustomException?: new (
    objectOrError?: string | object,
    description?: string,
  ) => HttpException;
}): never => {
  if (error instanceof HttpException) {
    const response = error.getResponse() as HttpExceptionResponse;
    const errorResponse: ErrorResponse = {
      message: response.message || error.message,
      error: response.error,
      status: error.getStatus(),
    };

    throw new CustomException(errorResponse);
  }

  const errorResponse: ErrorResponse = {
    message: error instanceof Error ? error.message : defaultMessage,
    error: CustomException.name,
    status: new CustomException().getStatus(),
  };

  throw new CustomException(errorResponse);
};
