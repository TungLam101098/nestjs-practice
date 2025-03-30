import { faker } from '@faker-js/faker';

import { VALIDATION_RULES } from '@/constants';
import { SortOrder } from '@/enums';
import { Metadata } from '@/interfaces';
import { CreateUserDto } from '@/modules/users/dtos/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dtos/update-user.dto';
import { UserQueryParamsDto } from '@/modules/users/dtos/user-query-params.dto';
import { User } from '@/modules/users/entities/user.entity';
import { Role } from '@/modules/users/enums/role.enum';
import { UserResponse } from '@/modules/users/interfaces/user-response.interface';

import { MOCK_DATE, MOCK_USER } from './constant.mock';

const { PAGINATION } = VALIDATION_RULES;
const { PAST } = MOCK_DATE;

/**
 * Generates a mock user response object for testing
 * Contains only public user information (no password)
 */
export const generateUserResponse = (): UserResponse => ({
  id: MOCK_USER.ID,
  email: MOCK_USER.EMAIL,
  name: faker.person.fullName(),
  phone: faker.phone.number({ style: 'international' }),
  role: Role.User,
  createdAt: PAST,
  updatedAt: PAST,
});

/**
 * Generates a complete user entity including password
 * Used for mocking database entities
 */
export const generateUserWithSensitiveData = (): User => ({
  ...generateUserResponse(),
  password: faker.internet.password(),
  isDeleted: false,
});

/**
 * Generates user creation DTO for testing registration
 * Includes all required fields for user creation
 */
export const generateCreateUserDto = (): CreateUserDto => ({
  email: MOCK_USER.EMAIL,
  password: faker.internet.password({ length: 12 }),
  name: faker.person.fullName(),
  phone: faker.phone.number(),
});

/**
 * Generates query parameters for user listing
 * Uses default pagination values from validation rules
 */
export const generateQueryParams = (): UserQueryParamsDto => ({
  page: PAGINATION.CURRENT_PAGE.DEFAULT_VALUE,
  limit: PAGINATION.ITEMS_PER_PAGE.DEFAULT_VALUE,
  sortBy: 'name',
  order: SortOrder.Asc,
  email: MOCK_USER.EMAIL,
});

/**
 * Generates a paginated response with metadata
 */
export const generatePaginatedResponse = <T>(
  data: T[],
  page = PAGINATION.CURRENT_PAGE.DEFAULT_VALUE,
  limit = PAGINATION.ITEMS_PER_PAGE.DEFAULT_VALUE,
): {
  data: T[];
  metadata: Metadata;
} => {
  const total = data.length;

  return {
    data,
    metadata: {
      page,
      limit,
      total,
      pageCount: Math.ceil(total / limit),
    },
  };
};

/**
 * Generates user update DTO for testing
 * Includes only fields that can be updated
 */
export const generateUpdateUserDto = (): UpdateUserDto => ({
  name: faker.person.fullName(),
  phone: faker.phone.number(),
  password: faker.internet.password({ length: 12 }),
});
