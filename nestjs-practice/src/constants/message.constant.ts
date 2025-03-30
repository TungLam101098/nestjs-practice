/**
 * Application message constants organized by feature
 * Contains all error and information messages used throughout the application
 */
export const MESSAGES = {
  // Validation messages
  VALIDATE_FAILED: 'Validation failed',
  VALIDATE_EMPTY_BODY: 'Request body cannot be empty',
  INVALID_REQUEST_PARAMETERS: 'Invalid request parameters',
  INVALID_ID: 'Invalid id format',
  INVALID_IMAGE_URL: 'Invalid image URL format',
  INVALID_CREDENTIALS: 'Invalid email or password',
  INVALID_PASSWORD:
    'Password must contain at least one uppercase letter, one lowercase letter, and one special character',
  REQUIRED_PASSWORD: 'Password is required',

  // Authentication messages
  MISSING_TOKEN: 'Access token is missing or invalid',
  PERMISSION_DENIED: 'You do not have permission to access this resource',

  // User related messages
  EMAIL_ALREADY_EXISTS: 'User with this email already exists',
  USER_NOT_FOUND: 'User not found',
  CREATE_USER_FAILED: 'Failed to create user',
  UPDATE_USER_FAILED: 'Failed to update user',
  DELETE_USER_FAILED: 'Failed to delete user',
  GET_USERS_FAILED: 'Failed to get users',
  FIND_USER_FAILED: 'Failed to find user',

  // Food related messages
  FOOD_NOT_FOUND: 'Food item not found',
  CREATE_FOOD_FAILED: 'Failed to create food item',
  UPDATE_FOOD_FAILED: 'Failed to update food item',
  DELETE_FOOD_FAILED: 'Failed to delete food item',
  GET_FOOD_FAILED: 'Failed to get food item',
  GET_FOODS_FAILED: 'Failed to get food items',
  REQUIRED_FOOD_ID: 'Food id is required',

  // Cart related messages
  CART_NOT_FOUND: 'Cart not found',
  CART_ITEMS_MUST_BE_ARRAY: 'Cart items must be an array',
  CART_MIN_ITEMS_REQUIRED: 'At least one item is required',
  CART_ITEMS_REQUIRED: 'Cart items are required',
  INVALID_CART_ITEM: 'Invalid cart item',
  ADD_TO_CART_FAILED: 'Failed to add item to cart',
  GET_CART_FAILED: 'Failed to get cart',
  REQUIRED_QUANTITY: 'Quantity is required',

  // Order related messages
  ORDER_NOT_FOUND: 'Order not found',
  ORDER_ITEM_NOT_FOUND: 'Order item not found',
  CREATE_ORDER_FAILED: 'Failed to create order',
  GET_ORDER_FAILED: 'Failed to get order',
  GET_ORDER_ITEM_FAILED: 'Failed to get order item',
  FIND_ORDERS_FAILED: 'Failed to find orders',
};
