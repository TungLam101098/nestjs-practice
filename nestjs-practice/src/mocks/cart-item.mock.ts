import { faker } from '@faker-js/faker';

import { CartItem } from '@/modules/cart-items/entities/cart-item.entity';
import { Cart } from '@/modules/carts/entities/cart.entity';

import { MOCK_CART, MOCK_DATE, MOCK_FOOD } from './constant.mock';

const { ID: FOOD_ID } = MOCK_FOOD;
const { PAST } = MOCK_DATE;

/**
 * Generates an array of mock cart items for testing
 */
export const generateCartItem = (): CartItem[] => [
  {
    id: MOCK_CART.CART_ITEM_ID,
    foodId: FOOD_ID,
    quantity: faker.number.int({ min: 1, max: 10 }),
    cartId: MOCK_CART.ID,
    food: {
      id: FOOD_ID,
      name: faker.commerce.productName(),
      price: faker.number.int({ min: 1000, max: 100000 }),
      description: faker.commerce.productDescription(),
      imageUrl: faker.image.url(),
      isDeleted: false,
      createdAt: PAST,
      updatedAt: PAST,
    },
    cart: new Cart(),
  },
];
