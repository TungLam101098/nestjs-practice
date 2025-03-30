import { faker } from '@faker-js/faker';

import { OrderStatus } from '@/enums';
import { AuthenticatedRequest } from '@/interfaces';
import { CreateOrderDto } from '@/modules/orders/dtos/create-order.dto';
import { Order } from '@/modules/orders/entities/order.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Role } from '@/modules/users/enums/role.enum';

import { MOCK_CART, MOCK_DATE, MOCK_ORDER, MOCK_USER } from './constant.mock';

const { ID: USER_ID } = MOCK_USER;
const { CART_ITEM_ID } = MOCK_CART;
const { PAST } = MOCK_DATE;

/**
 * Generates a mock order entity for testing
 */
export const generateOrder = (): Order => ({
  id: MOCK_ORDER.ID,
  userId: USER_ID,
  status: OrderStatus.Pending,
  totalAmount: faker.number.int({ min: 1, max: 1000 }),
  createdAt: PAST,
  items: [],
  user: new User(),
});

/**
 * Generates a mock authenticated request for order endpoints
 */
export const generateOrderRequest = (): AuthenticatedRequest =>
  ({
    user: {
      id: USER_ID,
      role: Role.User,
      email: MOCK_USER.EMAIL,
    },
  }) as AuthenticatedRequest;

/**
 * Generates a create order DTO for testing
 */
export const generateCreateOrderDto = (): CreateOrderDto => ({
  cartItemIds: [CART_ITEM_ID],
});
