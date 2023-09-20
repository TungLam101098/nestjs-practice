import jwt from 'jsonwebtoken';

import { TOKEN } from '@constants';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || TOKEN.ACCESS_TOKEN_SECRET;

/**
 * Generates a JSON Web Token (JWT) access token for a user.
 * @param {string} userId - The unique identifier of the user.
 * @param {boolean | undefined} isAdmin - Indicates whether the user has admin privileges.
 * @returns {string} - The JWT access token.
 */
const generateAccessToken = (userId: string, isAdmin: boolean | undefined) => {
  const payload = {
    userId,
    isAdmin,
  };

  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: TOKEN.EXPIRES_IN });
};

export { generateAccessToken };
