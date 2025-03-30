import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';

import { MESSAGES } from '@/constants';
import {
  generateCart,
  generateCreateOrderDto,
  generateOrder,
  MOCK_ERROR,
  MOCK_USER,
} from '@/mocks';
import { handleError } from '@/utils';

import { Cart } from '../../carts/entities/cart.entity';
import { Order } from '../entities/order.entity';
import { OrdersService } from '../orders.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepository: jest.Mocked<Repository<Order>>;
  let cartRepository: jest.Mocked<Repository<Cart>>;
  let queryRunner: jest.Mocked<QueryRunner>;

  // Mock order and cart objects
  const mockOrder = generateOrder();
  const mockCart = generateCart();

  beforeEach(async () => {
    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      manager: {
        save: jest.fn(),
        delete: jest.fn(),
      },
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    } as unknown as jest.Mocked<QueryRunner>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Cart),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(queryRunner),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderRepository = module.get(getRepositoryToken(Order));
    cartRepository = module.get(getRepositoryToken(Cart));
  });

  describe('createOrderFromCart', () => {
    const createOrderDto = generateCreateOrderDto();

    it('should create order successfully', async () => {
      // Arrange
      cartRepository.findOne.mockResolvedValue(mockCart);
      (queryRunner.manager.save as jest.Mock).mockResolvedValueOnce(mockOrder);
      orderRepository.findOne.mockResolvedValue(mockOrder);

      // Act
      const result = await service.createOrderFromCart(
        MOCK_USER.ID,
        createOrderDto,
      );

      // Assert
      expect(result).toEqual(mockOrder);
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should throw NotFoundException when cart is empty', async () => {
      // Arrange
      cartRepository.findOne.mockResolvedValue(null);
      jest.mocked(handleError).mockImplementation(() => {
        throw new NotFoundException(MESSAGES.ORDER_NOT_FOUND);
      });

      // Act & Assert
      await expect(
        service.createOrderFromCart(MOCK_USER.ID, createOrderDto),
      ).rejects.toThrow(NotFoundException);
      expect(queryRunner.startTransaction).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when no valid cart items found', async () => {
      // Arrange
      cartRepository.findOne.mockResolvedValue(mockCart);

      // Act & Assert
      await expect(
        service.createOrderFromCart(MOCK_USER.ID, { cartItemIds: [] }),
      ).rejects.toThrow();
      expect(queryRunner.startTransaction).not.toHaveBeenCalled();
    });

    it('should rollback transaction on error', async () => {
      // Arrange
      const error = new Error('Database error');
      cartRepository.findOne.mockResolvedValue(mockCart);
      (queryRunner.manager.save as jest.Mock).mockRejectedValue(error);
      jest.mocked(handleError).mockImplementation(() => {
        throw new InternalServerErrorException(MESSAGES.CREATE_ORDER_FAILED);
      });

      // Act & Assert
      await expect(
        service.createOrderFromCart(MOCK_USER.ID, createOrderDto),
      ).rejects.toThrow(InternalServerErrorException);

      // Verify transaction handling
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
      expect(handleError).toHaveBeenCalledWith({
        error,
        defaultMessage: MESSAGES.CREATE_ORDER_FAILED,
      });
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      // Arrange
      const expectedOrders = [mockOrder];
      orderRepository.find.mockResolvedValue(expectedOrders);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(expectedOrders);
      expect(orderRepository.find).toHaveBeenCalledWith({
        relations: ['items', 'items.food'],
      });
    });

    it('should handle error when finding orders fails', async () => {
      // Arrange
      orderRepository.find.mockRejectedValue(MOCK_ERROR);
      jest.mocked(handleError).mockImplementation(() => {
        throw new InternalServerErrorException(MOCK_ERROR);
      });

      // Act & Assert
      await expect(service.findAll()).rejects.toThrow();
    });
  });

  describe('findById', () => {
    it('should return order by id', async () => {
      // Arrange
      orderRepository.findOne.mockResolvedValue(mockOrder);

      // Act
      const result = await service.findById(MOCK_USER.ID, mockOrder.id);

      // Assert
      expect(result).toEqual(mockOrder);
      expect(orderRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockOrder.id, userId: MOCK_USER.ID },
        relations: ['items', 'items.food'],
      });
    });

    it('should throw NotFoundException when order not found', async () => {
      // Arrange
      orderRepository.findOne.mockResolvedValue(null);
      jest.mocked(handleError).mockImplementation(() => {
        throw new NotFoundException();
      });

      // Act & Assert
      await expect(
        service.findById(MOCK_USER.ID, 'non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findUserOrders', () => {
    it('should return user orders', async () => {
      // Arrange
      const expectedOrders = [mockOrder];
      orderRepository.find.mockResolvedValue(expectedOrders);

      // Act
      const result = await service.findUserOrders(MOCK_USER.ID);

      // Assert
      expect(result).toEqual(expectedOrders);
      expect(orderRepository.find).toHaveBeenCalledWith({
        where: { userId: MOCK_USER.ID },
        relations: ['items', 'items.food'],
      });
    });

    it('should throw InternalServerErrorException when finding orders fails', async () => {
      // Arrange
      orderRepository.find.mockRejectedValue(MOCK_ERROR);
      jest.mocked(handleError).mockImplementation(() => {
        throw new InternalServerErrorException(MESSAGES.FIND_ORDERS_FAILED);
      });

      // Act & Assert
      await expect(service.findUserOrders(MOCK_USER.ID)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
