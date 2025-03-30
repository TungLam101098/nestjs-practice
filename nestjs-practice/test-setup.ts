/**
 * Jest setup file
 * This file is used to setup the environment before running the tests
 */
jest.mock('@/utils', () => ({
  hashPassword: jest.fn(),
  updateEntity: jest.fn(),
  paginate: jest.fn(),
  applyFilters: jest.fn(),
  applySort: jest.fn(),
  handleError: jest.fn(),
  getSelectFields: jest.fn(),
  isPasswordValid: jest.fn(),
  getCurrentTimestamp: jest.fn(),
}));
