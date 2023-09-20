import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';

import { getUserByUsername, saveUser } from '@services/user';
import { logger, ensureError, generateAccessToken } from '@utils';
import { User } from '@interfaces';
import { EXCEPTIONS } from '@constants';

let authInstance: AuthController | null = null;

class AuthController {
  /**
   * Handle user registration requests.
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @param {NextFunction} next - The next middleware function in the processing chain.
   */
  async handleRegistrationRequest(req: Request, res: Response, next: NextFunction) {
    // TODO: Verify the body request using middleware
    try {
      const { username, password, email, isAdmin }: User = req.body;
      const isInvalidRequest = !username || !password || !email;

      if (isInvalidRequest) {
        return next(EXCEPTIONS.BAD_REQUEST_EXCEPTION);
      }

      const foundUser = await getUserByUsername(username);

      if (foundUser) {
        return next(EXCEPTIONS.USERNAME_EXISTS_EXCEPTION);
      }

      const user = await saveUser({
        username,
        password,
        email,
        isAdmin,
      });

      if (user) {
        res.send({ username: user.username, email: user.email });
      }
    } catch (error: unknown) {
      // Catch error while saving or finding user: missing field, username length too short..
      const { message } = ensureError(error);
      logger.error(message);

      next(EXCEPTIONS.SERVICE_UNAVAILABLE_EXCEPTION);
    }
  }

  /**
   * Handle user login requests.
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @param {NextFunction} next - The next middleware function in the processing chain.
   */
  async handleLoginRequest(req: Request, res: Response, next: NextFunction) {
    // TODO: Update verify the body request using middleware
    try {
      const { username, password }: User = req.body;
      const isInvalidRequest = !username || !password;

      if (isInvalidRequest) {
        return next(EXCEPTIONS.BAD_REQUEST_EXCEPTION);
      }

      const user = await getUserByUsername(username);

      if (!user) {
        return next(EXCEPTIONS.USERNAME_NO_EXISTS_EXCEPTION);
      }

      const isInvalidPassword = !bcrypt.compareSync(password, user.password);

      if (isInvalidPassword) {
        return next(EXCEPTIONS.INVALID_PASSWORD_EXCEPTION);
      }

      const userId = user._id.toHexString();
      const token = generateAccessToken(userId, user.isAdmin);

      res.send({ token });
    } catch (error) {
      // Catch error while finding user
      const { message } = ensureError(error);
      logger.error(message);

      next(EXCEPTIONS.SERVICE_UNAVAILABLE_EXCEPTION);
    }
  }

  /**
   * Get singleton authentication controller instance
   */
  static getInstance() {
    if (!authInstance) {
      authInstance = new AuthController();
    }

    return authInstance;
  }
}

export default AuthController;
