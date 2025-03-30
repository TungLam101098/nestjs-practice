import { faker } from '@faker-js/faker';

import { Role } from '@/modules/users/enums/role.enum';

import { MOCK_USER } from './constant.mock';

const { ID, EMAIL } = MOCK_USER;

/**
 * Generates a mock JWT payload for testing
 */
export const generatePayload = () => ({
  id: ID,
  email: EMAIL,
  role: Role.User,
  iat: faker.number.int(10),
  exp: faker.number.int(10),
});
