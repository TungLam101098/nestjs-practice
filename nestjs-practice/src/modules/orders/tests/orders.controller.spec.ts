import { Test, TestingModule } from '@nestjs/testing';

import {
  generateCreateOrderDto,
  generateOrder,
  generateOrderRequest,
} from '@/mocks';

import { OrdersController } from '../orders.controller';
import { OrdersService } from '../orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: jest.Mocked<OrdersService>;

  // Mock order and request objects
  const mockOrder = generateOrder();
  const mockRequest = generateOrderRequest();

  // Reset mock service before each test
  beforeEach(async () => {
    const mockOrdersService = {
      findUserOrders: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      createOrderFromCart: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(
      OrdersService,
    ) as jest.Mocked<OrdersService>;
  });

  describe('findUserOrders', () => {
    it('should return orders for authenticated user', async () => {
      // Arrange
      const expectedOrders = [mockOrder];
      service.findUserOrders.mockResolvedValue(expectedOrders);

      // Act
      const result = await controller.findUserOrders(mockRequest);

      // Assert
      expect(result).toEqual(expectedOrders);
      expect(service.findUserOrders).toHaveBeenCalledWith(mockRequest.user.id);
    });
  });

  describe('findAll', () => {
    it('should return all orders (admin only)', async () => {
      // Arrange
      const expectedOrders = [mockOrder];
      service.findAll.mockResolvedValue(expectedOrders);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual(expectedOrders);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return specific order for authenticated user', async () => {
      // Arrange
      const orderId = mockOrder.id;
      service.findById.mockResolvedValue(mockOrder);

      // Act
      const result = await controller.findById(mockRequest, orderId);

      // Assert
      expect(result).toEqual(mockOrder);
      expect(service.findById).toHaveBeenCalledWith(
        mockRequest.user.id,
        orderId,
      );
    });
  });

  describe('createOrder', () => {
    it('should create new order from cart', async () => {
      // Arrange
      const createOrderDto = generateCreateOrderDto();
      service.createOrderFromCart.mockResolvedValue(mockOrder);

      // Act
      const result = await controller.createOrder(mockRequest, createOrderDto);

      // Assert
      expect(result).toEqual(mockOrder);
      expect(service.createOrderFromCart).toHaveBeenCalledWith(
        mockRequest.user.id,
        createOrderDto,
      );
    });
  });
});
