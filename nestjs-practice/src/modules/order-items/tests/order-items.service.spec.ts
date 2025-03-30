import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MESSAGES } from '@/constants';
import { generateOrder, MOCK_ERROR } from '@/mocks';
import { generateOrderItem } from '@/mocks/order-item.mock';
import { handleError } from '@/utils';

import { OrdersService } from '../../orders/orders.service';
import { OrderItem } from '../entities/order-item.entity';
import { OrderItemsService } from '../order-items.service';

describe('OrderItemsService', () => {
  let service: OrderItemsService;
  let repository: jest.Mocked<Repository<OrderItem>>;
  let ordersService: jest.Mocked<OrdersService>;

  // Create a mock order and order item
  const mockOrder = generateOrder();
  const mockOrderItem: OrderItem = generateOrderItem();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemsService,
        {
          provide: getRepositoryToken(OrderItem),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: OrdersService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderItemsService>(OrderItemsService);
    repository = module.get(getRepositoryToken(OrderItem));
    ordersService = module.get(OrdersService);
  });

  describe('getOrderItemById', () => {
    const userId = mockOrder.userId;
    const itemId = mockOrderItem.id;

    it('should return order item when user is authorized', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(mockOrderItem);
      ordersService.findById.mockResolvedValue(mockOrder);

      // Act
      const result = await service.getOrderItemById(userId, itemId);

      // Assert
      expect(result).toEqual(mockOrderItem);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: itemId },
        relations: ['food'],
      });
      expect(ordersService.findById).toHaveBeenCalledWith(userId, mockOrder.id);
    });

    it('should throw NotFoundException when order item not found', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(null);
      jest.mocked(handleError).mockImplementation(() => {
        throw new NotFoundException(MESSAGES.ORDER_ITEM_NOT_FOUND);
      });

      // Act & Assert
      await expect(service.getOrderItemById(userId, itemId)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalled();
      expect(ordersService.findById).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user is unauthorized', async () => {
      // Arrange
      const unauthorizedUserId = 'unauthorized-user';
      repository.findOne.mockResolvedValue(mockOrderItem);
      ordersService.findById.mockResolvedValue({
        ...mockOrder,
        userId: 'different-user',
      });
      jest.mocked(handleError).mockImplementation(() => {
        throw new ForbiddenException(MESSAGES.PERMISSION_DENIED);
      });

      // Act & Assert
      await expect(
        service.getOrderItemById(unauthorizedUserId, itemId),
      ).rejects.toThrow(ForbiddenException);
      expect(repository.findOne).toHaveBeenCalled();
      expect(ordersService.findById).toHaveBeenCalled();
    });

    it('should handle unexpected errors', async () => {
      // Arrange
      repository.findOne.mockRejectedValue(MOCK_ERROR);
      jest.mocked(handleError).mockImplementation(() => {
        throw new InternalServerErrorException(MOCK_ERROR);
      });

      // Act & Assert
      await expect(service.getOrderItemById(userId, itemId)).rejects.toThrow(
        MOCK_ERROR,
      );
      expect(handleError).toHaveBeenCalledWith({
        error: MOCK_ERROR,
        defaultMessage: MESSAGES.GET_ORDER_ITEM_FAILED,
      });
    });
  });
});
