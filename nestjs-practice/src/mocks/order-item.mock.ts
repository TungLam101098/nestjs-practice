import { faker } from '@faker-js/faker';

import { Food } from '@/modules/foods/entities/food.entity';
import { OrderItem } from '@/modules/order-items/entities/order-item.entity';
import { Order } from '@/modules/orders/entities/order.entity';

import { MOCK_FOOD, MOCK_ORDER } from './constant.mock';

const { ID: FOOD_ID } = MOCK_FOOD;
const { ID: ORDER_ID } = MOCK_ORDER;

/**
 * Generates a mock order item entity for testing
 */
export const generateOrderItem = (): OrderItem => ({
  id: faker.string.uuid(),
  orderId: ORDER_ID,
  foodId: FOOD_ID,
  quantity: faker.number.int({ min: 1, max: 10 }),
  food: new Food(),
  order: new Order(),
  totalAmount: faker.number.int({ min: 1000, max: 100000 }),
});
