import { Request, Response, NextFunction } from 'express';

import HttpException from '@exceptions/HttpException';
import { MESSAGES } from '@constants';

/**
 * @param {Request}
 * @param {Response}
 * Respond to request with status 404 for route not found
 */
const handleRouteNotFound = (request: Request, response: Response) => {
  const { PATH_NOT_FOUND } = MESSAGES.ERROR;

  response.status(PATH_NOT_FOUND.CODE).send({
    code: PATH_NOT_FOUND.CODE,
    message: PATH_NOT_FOUND.MESSAGE,
  });
};

/**
 * Middleware to handle general errors and send an appropriate response.
 * @param {HttpException} error - The error object.
 * @param {Request} _request - The Express request object.
 * @param {Response} response - The Express response object.
 * @param {NextFunction} _next - The Express next function (unused, but required).
 */
const handleGeneralError = (
  error: HttpException,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  const { INTERNAL_SERVER } = MESSAGES.ERROR;
  const status = error.status || INTERNAL_SERVER.CODE;
  const message = error.message || INTERNAL_SERVER.MESSAGE;

  response.status(status).send({
    status,
    message,
  });
};

export { handleRouteNotFound, handleGeneralError };
