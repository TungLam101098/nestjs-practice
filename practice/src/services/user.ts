import user from '@schemas/user';

import UserDTO from '@dto/user';
import User from '@interfaces/user';

/**
 * Save user data into database
 * @param {User} user data to save database
 * @return {User} user is saved into database
 */
const saveUser = async (userData: User) => {
  const userDTO = new UserDTO(userData);

  return await user.create(userDTO);
};

/**
 * Get user by username from database
 * @param {String} username
 * @return {User} user is found in database
 */
const getUserByUsername = async (username: string) => await user.findOne({ username }).exec();

export { saveUser, getUserByUsername };
