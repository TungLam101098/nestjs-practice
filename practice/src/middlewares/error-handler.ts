import { Request, Response } from 'express';

import { MESSAGE } from '../constants';

/**
 * @param {Request}
 * @param {Response}
 * Respond to request with status 404 for route not found
 */
const handleRouteNotFound = (request: Request, response: Response) => {
  const { PATH_NOT_FOUND } = MESSAGE.ERROR;

  response.status(PATH_NOT_FOUND.CODE).send({
    code: PATH_NOT_FOUND.CODE,
    message: PATH_NOT_FOUND.MESSAGE,
  });
};

export { handleRouteNotFound };
