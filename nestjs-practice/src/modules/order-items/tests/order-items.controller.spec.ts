import { Test, TestingModule } from '@nestjs/testing';

import { generateOrderRequest, MOCK_ERROR } from '@/mocks';
import { generateOrderItem } from '@/mocks/order-item.mock';

import { OrderItemsController } from '../order-items.controller';
import { OrderItemsService } from '../order-items.service';

describe('OrderItemsController', () => {
  let controller: OrderItemsController;
  let service: jest.Mocked<OrderItemsService>;

  // Create a mock order item and request
  const mockOrderItem = generateOrderItem();
  const mockRequest = generateOrderRequest();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemsController],
      providers: [
        {
          provide: OrderItemsService,
          useValue: {
            getOrderItemById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderItemsController>(OrderItemsController);
    service = module.get<OrderItemsService>(
      OrderItemsService,
    ) as jest.Mocked<OrderItemsService>;
  });

  describe('getOrderItemById', () => {
    it('should return order item by id', async () => {
      // Arrange
      service.getOrderItemById.mockResolvedValue(mockOrderItem);
      const itemId = mockOrderItem.id;

      // Act
      const result = await controller.getOrderItemById(mockRequest, itemId);

      // Assert
      expect(result).toEqual(mockOrderItem);
      expect(service.getOrderItemById).toHaveBeenCalledWith(
        mockRequest.user.id,
        itemId,
      );
    });

    it('should propagate errors from service', async () => {
      // Arrange
      service.getOrderItemById.mockRejectedValue(MOCK_ERROR);
      const itemId = 'non-existent-id';

      // Act & Assert
      await expect(
        controller.getOrderItemById(mockRequest, itemId),
      ).rejects.toThrow(MOCK_ERROR);

      expect(service.getOrderItemById).toHaveBeenCalledWith(
        mockRequest.user.id,
        itemId,
      );
    });
  });
});
