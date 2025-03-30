import { CreateCartDto } from '@/modules/carts/dtos/create-cart.dto';
import { Cart } from '@/modules/carts/entities/cart.entity';
import { User } from '@/modules/users/entities/user.entity';

import { generateCartItem } from './cart-item.mock';
import { MOCK_CART, MOCK_DATE, MOCK_FOOD, MOCK_USER } from './constant.mock';

const { ID: FOOD_ID } = MOCK_FOOD;
const { ID: USER_ID } = MOCK_USER;
const { PAST } = MOCK_DATE;
const MOCK_QUANTITY = 2;

/**
 * Generates a mock cart entity for testing
 */
export const generateCart = (): Cart => ({
  id: MOCK_CART.ID,
  userId: USER_ID,
  items: generateCartItem(),
  createdAt: PAST,
  updatedAt: PAST,
  user: new User(),
});

/**
 * Generates cart creation DTO for testing
 */
export const generateCreateCartDto = (): CreateCartDto => ({
  items: [
    {
      foodId: FOOD_ID,
      quantity: MOCK_QUANTITY,
    },
  ],
});
