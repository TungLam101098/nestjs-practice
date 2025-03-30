import { Test, TestingModule } from '@nestjs/testing';

import {
  generateCart,
  generateCartItem,
  generateCreateCartDto,
  generateOrderRequest,
  MOCK_ERROR,
} from '@/mocks';

import { CartsController } from '../carts.controller';
import { CartsService } from '../carts.service';
import { CreateCartDto } from '../dtos/create-cart.dto';
import { Cart } from '../entities/cart.entity';

describe('CartsController', () => {
  let controller: CartsController;
  let service: jest.Mocked<CartsService>;

  // Create cart items, cart, and order request mocks
  const mockCartItems = generateCartItem();
  const mockCart = generateCart();
  const mockRequest = generateOrderRequest();

  beforeEach(async () => {
    const mockCartsService = {
      getUserCart: jest.fn(),
      addToCart: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartsController],
      providers: [
        {
          provide: CartsService,
          useValue: mockCartsService,
        },
      ],
    }).compile();

    controller = module.get<CartsController>(CartsController);
    service = module.get<CartsService>(
      CartsService,
    ) as jest.Mocked<CartsService>;
  });

  describe('getUserCart', () => {
    it('should return user cart with items', async () => {
      // Arrange
      service.getUserCart.mockResolvedValue(mockCart);

      // Act
      const result = await controller.getUserCart(mockRequest);

      // Assert
      expect(result).toEqual(mockCart);
      expect(result.items).toHaveLength(1);
      expect(service.getUserCart).toHaveBeenCalledWith(mockRequest.user.id);
    });

    it('should return empty cart when no items exist', async () => {
      // Arrange
      const emptyCart = { ...mockCart, items: [] };
      service.getUserCart.mockResolvedValue(emptyCart);

      // Act
      const result = await controller.getUserCart(mockRequest);

      // Assert
      expect(result.items).toHaveLength(0);
      expect(service.getUserCart).toHaveBeenCalledWith(mockRequest.user.id);
    });
  });

  describe('addToCart', () => {
    it('should add item to cart', async () => {
      // Arrange
      const createCartDto = generateCreateCartDto();
      const updatedCart: Cart = {
        ...mockCart,
        items: mockCartItems,
      };
      service.addToCart.mockResolvedValue(updatedCart);

      // Act
      const result = await controller.addToCart(mockRequest, createCartDto);

      // Assert
      expect(result.items).toHaveLength(1);
      expect(service.addToCart).toHaveBeenCalledWith(
        mockRequest.user.id,
        createCartDto,
      );
    });

    it('should handle empty items array', async () => {
      // Arrange
      const createCartDto: CreateCartDto = { items: [] };
      service.addToCart.mockResolvedValue(mockCart);

      // Act & Assert
      await expect(
        controller.addToCart(mockRequest, createCartDto),
      ).resolves.toEqual(mockCart);

      expect(service.addToCart).toHaveBeenCalledWith(
        mockRequest.user.id,
        createCartDto,
      );
    });

    it('should propagate service errors', async () => {
      // Arrange
      const createCartDto = generateCreateCartDto();
      service.addToCart.mockRejectedValue(MOCK_ERROR);

      // Act & Assert
      await expect(
        controller.addToCart(mockRequest, createCartDto),
      ).rejects.toThrow(MOCK_ERROR);
    });
  });
});
