/**
 * Contains validation rules constants used across the application
 */
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 100,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
  },
  PAGINATION: {
    CURRENT_PAGE: {
      DEFAULT_VALUE: 1,
    },
    ITEMS_PER_PAGE: {
      MIN_VALUE: 1,
      MAX_VALUE: 50,
      DEFAULT_VALUE: 10,
    },
  },
  DESCRIPTION: {
    MAX_LENGTH: 1500,
  },
  PRICE: {
    MIN_VALUE: 1,
  },
  CART: {
    MIN_ITEMS: 1,
  },
  QUANTITY: {
    MIN_VALUE: 1,
    MAX_VALUE: 10,
  },
};
