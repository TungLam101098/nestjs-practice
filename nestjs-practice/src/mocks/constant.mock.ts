import { faker } from '@faker-js/faker';
import { DeleteResult } from 'typeorm';

/**
 * Mock authentication constants for testing
 */
export const MOCK_AUTH = {
  ACCESS_TOKEN: faker.lorem.word(32),
};

/**
 * Mock cart constants for testing
 */
export const MOCK_CART = {
  ID: faker.string.uuid(),
  CART_ITEM_ID: faker.string.uuid(),
};

/**
 * Mock date constants for testing
 */
export const MOCK_DATE = {
  NOW: faker.date.recent(),
  PAST: faker.date.past(),
  FUTURE: faker.date.future(),
};

/**
 * Mock Error object for testing error handling scenarios
 */
export const MOCK_ERROR = new Error('Test error');

/**
 * Mock food constants for testing
 */
export const MOCK_FOOD = {
  ID: faker.string.uuid(),
  NAME: faker.commerce.productName(),
  DESCRIPTION: faker.commerce.productDescription(),
  PRICE: faker.number.int({ min: 1, max: 1000 }),
  IMAGE_URL: faker.image.avatar(),
};

/**
 * Mock order constants for testing
 */
export const MOCK_ORDER = {
  ID: faker.string.uuid(),
  ORDER_ITEM_ID: faker.string.uuid(),
};

/**
 * Mock TypeORM DeleteResult for testing delete operations
 */
export const MOCK_DELETE_RESULT: DeleteResult = {
  affected: 1,
  raw: [],
};

/**
 * Mock user constants for testing
 */
export const MOCK_USER = {
  ID: faker.string.uuid(),
  EMAIL: faker.internet.email(),
};
