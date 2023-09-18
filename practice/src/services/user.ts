import user from '@schemas/user';

import { logger, ensureError } from '@utils';
import User from '@interfaces/user';

/**
 * @param {User} user data to save database
 * Save user data into database
 */
const saveUser = async (userData: User) => {
  try {
    return await user.create(userData);
  } catch (error: unknown) {
    const { message } = ensureError(error);

    logger.error(message);
  }
};

/**
 * @param {String} username
 * Get user by username from database
 */
const getUserByUsername = async (username: string) => {
  try {
    return await user.findOne({ username }).exec();
  } catch (error: unknown) {
    const { message } = ensureError(error);

    logger.error(message);
  }
};

export { saveUser, getUserByUsername };
