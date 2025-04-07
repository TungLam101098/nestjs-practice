import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { MESSAGES } from '@/constants';
import { CartItem } from '@/modules/cart-items/entities/cart-item.entity';
import { Food } from '@/modules/foods/entities/food.entity';
import { handleError } from '@/utils';

import { CreateCartDto } from './dtos/create-cart.dto';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Food)
    private foodRepository: Repository<Food>,
    private dataSource: DataSource,
  ) {}

  // Add logger
  private readonly logger = new Logger(CartsService.name);

  /**
   * Retrieves a cart for a user
   * Creates a new cart if user doesn't have one
   *
   * @param userId - User id
   * @returns Cart
   */
  async getUserCart(userId: string): Promise<Cart> {
    try {
      this.logger.log(`Fetching cart for user with ID ${userId}`);

      // Find user's cart
      let cart = await this.cartsRepository.findOne({
        where: { userId },
        relations: ['items', 'items.food'],
      });

      // Create new cart if user doesn't have one
      if (!cart) {
        this.logger.log(`Creating cart for user with ID ${userId}`);
        const cartItems = [];

        cart = this.cartsRepository.create({ userId, items: cartItems });
        await this.cartsRepository.save(cart);
      }

      this.logger.log(`Cart for user with ID ${userId} found`);

      return cart;
    } catch (error: unknown) {
      this.logger.error(
        `Failed to fetch cart for user with ID ${userId}: ${JSON.stringify(error)}`,
      );

      return handleError({
        error,
        defaultMessage: MESSAGES.GET_CART_FAILED,
      });
    }
  }

  /**
   * Adds multiple items to user's cart
   *
   * @param {string} userId - id of the user
   * @param {CreateCartDto} createCartDto - Cart items data containing array of food items
   * @returns {Promise<Cart>} Updated cart with items
   * @throws {NotFoundException} When food item or cart not found
   * @throws {InternalServerErrorException} When database operation fails
   */
  async addToCart(userId: string, createCartDto: CreateCartDto): Promise<Cart> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.log(`Adding items to cart for user with ID ${userId}`);

      // Get user's cart or create one
      let cart = await this.cartsRepository.findOne({ where: { userId } });
      if (!cart) {
        this.logger.log(`Creating cart for user with ID ${userId}`);

        cart = this.cartsRepository.create({ userId });
        cart = await queryRunner.manager.save(cart);
      }

      // Process each item in the items array
      for (const item of createCartDto.items) {
        // Check if food exists and is available
        const food = await this.foodRepository.findOne({
          where: { id: item.foodId },
        });

        if (!food) {
          this.logger.error(`Food with ID ${item.foodId} not found`);

          return handleError({
            defaultMessage: `Food with ID ${item.foodId} not found`,
            ExceptionClass: NotFoundException,
          });
        }

        // Check if item already exists in cart
        let cartItem = await this.cartItemRepository.findOne({
          where: { cartId: cart.id, foodId: item.foodId },
        });

        if (cartItem) {
          this.logger.log(
            `Updating quantity of food with ID ${item.foodId} in cart`,
          );

          // Update quantity if item already in cart
          cartItem.quantity += item.quantity;
          await queryRunner.manager.save(cartItem);
        } else {
          this.logger.log(`Adding new food with ID ${item.foodId} to cart`);

          // Add new cart item
          cartItem = this.cartItemRepository.create({
            cartId: cart.id,
            foodId: item.foodId,
            quantity: item.quantity,
          });
          await queryRunner.manager.save(cartItem);
        }
      }

      await queryRunner.commitTransaction();

      // Return updated cart with items
      const updatedCart = await this.cartsRepository.findOne({
        where: { id: cart.id },
        relations: ['items', 'items.food'],
      });

      if (!updatedCart) {
        this.logger.error(`Cart with ID ${cart.id} not found`);

        return handleError({
          defaultMessage: MESSAGES.CART_NOT_FOUND,
          ExceptionClass: NotFoundException,
        });
      }

      this.logger.log(`Items added to cart for user with ID ${userId}`);

      return updatedCart;
    } catch (error) {
      this.logger.error(
        `Failed to add items to cart for user with ID ${userId}: ${JSON.stringify(error)}`,
      );

      // Rollback transaction if error occurs
      await queryRunner.rollbackTransaction();

      return handleError({
        error,
        defaultMessage: MESSAGES.ADD_TO_CART_FAILED,
      });
    } finally {
      this.logger.log('Closing query runner');

      // Release query runner
      await queryRunner.release();
    }
  }
}
