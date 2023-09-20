import jwt, { VerifyErrors, JwtPayload } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';

import { AuthenticatedRequest } from '@interfaces/request';
import { TOKEN, EXCEPTIONS } from '@constants';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || TOKEN.ACCESS_TOKEN_SECRET;

/**
 * Middleware function to authenticate a user's access token.
 * If the token is valid, it attaches the userId, isAdmin to the request object.
 * If the token is invalid or missing, it returns an HTTP exception.
 * @param {AuthenticatedRequest} req - The Express request object.
 * @param {Response} _res - The Express response object (unused in this function).
 * @param {NextFunction} next - The next middleware function.
 */
const verifyToken = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(EXCEPTIONS.NON_AUTHORIZATION_EXCEPTION);
  }

  jwt.verify(
    token,
    ACCESS_TOKEN_SECRET,
    (error: VerifyErrors | null, user: string | JwtPayload | undefined) => {
      // Check for error, invalid user, or missing 'userId', 'isAdmin properties
      if (
        error ||
        !user ||
        !(typeof user === 'object') ||
        !('userId' in user) ||
        !('isAdmin' in user)
      ) {
        return next(EXCEPTIONS.PERMISSION_DENIED_EXCEPTION);
      }

      req.userId = user.userId;
      req.isAdmin = user.isAdmin;

      next();
    }
  );
};

export { verifyToken };
