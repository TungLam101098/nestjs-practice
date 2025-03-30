import { FindOptionsSelect } from 'typeorm';

import { User } from '../entities/user.entity';

/**
 * Configuration for user fields to be returned in responses
 * Excludes sensitive data like passwords
 */
export const USER_SELECT_FIELDS: FindOptionsSelect<User> = {
  id: true,
  role: true,
  email: true,
  name: true,
  phone: true,
  createdAt: true,
  updatedAt: true,
  password: false, // Explicitly exclude password
};
