import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';

import { MESSAGES } from '@/constants';
import {
  generateCart,
  generateCartItem,
  generateCreateCartDto,
  generateFood,
  MOCK_ERROR,
  MOCK_USER,
} from '@/mocks';
import { CartItem } from '@/modules/cart-items/entities/cart-item.entity';
import { Food } from '@/modules/foods/entities/food.entity';
import { handleError } from '@/utils';

import { CartsService } from '../carts.service';
import { Cart } from '../entities/cart.entity';

describe('CartsService', () => {
  let service: CartsService;
  let cartRepository: jest.Mocked<Repository<Cart>>;
  let cartItemRepository: jest.Mocked<Repository<CartItem>>;
  let foodRepository: jest.Mocked<Repository<Food>>;
  let queryRunner: jest.Mocked<QueryRunner>;

  // Create mock food, cart item, and cart entities
  const mockFood = generateFood();
  const mockCartItem = generateCartItem()[0];
  const mockCart = generateCart();

  beforeEach(async () => {
    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    } as unknown as jest.Mocked<QueryRunner>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        {
          provide: getRepositoryToken(Cart),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CartItem),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Food),
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

    service = module.get<CartsService>(CartsService);
    cartRepository = module.get(getRepositoryToken(Cart));
    cartItemRepository = module.get(getRepositoryToken(CartItem));
    foodRepository = module.get(getRepositoryToken(Food));
  });

  describe('getUserCart', () => {
    it('should return existing cart with items', async () => {
      // Arrange
      cartRepository.findOne.mockResolvedValue(mockCart);

      // Act
      const result = await service.getUserCart(MOCK_USER.ID);

      // Assert
      expect(result).toEqual(mockCart);
      expect(cartRepository.findOne).toHaveBeenCalledWith({
        where: { userId: MOCK_USER.ID },
        relations: ['items', 'items.food'],
      });
    });

    it('should create new cart when none exists', async () => {
      // Arrange
      cartRepository.findOne.mockResolvedValue(null);
      cartRepository.create.mockReturnValue(mockCart);
      cartRepository.save.mockResolvedValue(mockCart);

      // Act
      const result = await service.getUserCart(MOCK_USER.ID);

      // Assert
      expect(result).toEqual(mockCart);
      expect(cartRepository.create).toHaveBeenCalled();
      expect(cartRepository.save).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      // Arrange
      cartRepository.findOne.mockRejectedValue(MOCK_ERROR);
      jest.mocked(handleError).mockImplementation(() => {
        throw new InternalServerErrorException(MOCK_ERROR);
      });

      // Act & Assert
      await expect(service.getUserCart(MOCK_USER.ID)).rejects.toThrow(
        MOCK_ERROR,
      );

      expect(handleError).toHaveBeenCalledWith({
        error: MOCK_ERROR,
        defaultMessage: MESSAGES.GET_CART_FAILED,
      });
    });
  });

  describe('addToCart', () => {
    const createCartDto = generateCreateCartDto();

    it('should add new items to cart', async () => {
      // Arrange
      cartRepository.findOne
        .mockResolvedValueOnce(mockCart)
        .mockResolvedValueOnce(mockCart); // Second call for updated cart
      foodRepository.findOne.mockResolvedValue(mockFood);
      cartItemRepository.findOne.mockResolvedValue(null);
      cartItemRepository.create.mockReturnValue(mockCartItem);
      (queryRunner.manager.save as jest.Mock).mockResolvedValue(mockCartItem);

      // Act
      const result = await service.addToCart(MOCK_USER.ID, createCartDto);

      // Assert
      expect(result).toEqual(mockCart);
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should update quantity for existing cart item', async () => {
      // Arrange
      const existingCartItem = { ...mockCartItem, quantity: 1 };
      const updatedCartItem = { ...mockCartItem, quantity: 3 };

      cartRepository.findOne
        .mockResolvedValueOnce(mockCart)
        .mockResolvedValueOnce(mockCart);
      foodRepository.findOne.mockResolvedValue(mockFood);
      cartItemRepository.findOne.mockResolvedValue(existingCartItem);
      (queryRunner.manager.save as jest.Mock).mockResolvedValue(
        updatedCartItem,
      );

      // Act
      const result = await service.addToCart(MOCK_USER.ID, createCartDto);

      // Assert
      expect(result).toEqual(mockCart);
      expect(queryRunner.manager.save).toHaveBeenCalledWith(
        expect.objectContaining({ quantity: 3 }),
      );
    });

    it('should throw NotFoundException when food not found', async () => {
      // Arrange
      cartRepository.findOne.mockResolvedValue(mockCart);
      foodRepository.findOne.mockResolvedValue(null);
      jest.mocked(handleError).mockImplementation(() => {
        throw new NotFoundException(MESSAGES.CART_NOT_FOUND);
      });

      // Act & Assert
      await expect(
        service.addToCart(MOCK_USER.ID, createCartDto),
      ).rejects.toThrow(NotFoundException);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should rollback transaction on error', async () => {
      // Arrange
      cartRepository.findOne.mockRejectedValue(MOCK_ERROR);
      jest.mocked(handleError).mockImplementation(() => {
        throw new InternalServerErrorException(MOCK_ERROR);
      });

      // Act & Assert
      await expect(
        service.addToCart(MOCK_USER.ID, createCartDto),
      ).rejects.toThrow(MOCK_ERROR);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
      expect(handleError).toHaveBeenCalledWith({
        error: MOCK_ERROR,
        defaultMessage: MESSAGES.ADD_TO_CART_FAILED,
      });
    });
  });
});
