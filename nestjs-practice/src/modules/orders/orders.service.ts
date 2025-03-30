import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { MESSAGES } from '@/constants';
import { OrderStatus } from '@/enums';
import { applySort, handleError, paginate } from '@/utils';

import { CartItem } from '../cart-items/entities/cart-item.entity';
import { Cart } from '../carts/entities/cart.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderQueryParamsDto } from './dtos/order-query-params.dto';
import { OrdersResponseDto } from './dtos/orders-response.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private dataSource: DataSource,
  ) {}

  // Add logger
  private readonly logger = new Logger(OrdersService.name);

  /**
   * Creates a new order from selected cart items using a transaction
   * Handles cart validation, order creation, and cart item cleanup
   *
   * @param userId - ID of the user creating the order
   * @param createOrderDto - DTO containing cart item IDs to order
   * @returns Promise<Order> Created order with items and food details
   * @throws {NotFoundException} If cart is empty or not found
   * @throws {BadRequestException} If no valid cart items found
   */
  async createOrderFromCart(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    this.logger.log(`Creating order for user ${userId}`);

    // Find user's cart
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.food'],
    });

    if (!cart || cart.items.length === 0) {
      this.logger.error(`Cart not found for user ${userId}`);

      return handleError({
        defaultMessage: MESSAGES.CART_NOT_FOUND,
        CustomException: NotFoundException,
      });
    }

    // Find selected cart items
    const cartItemIds = createOrderDto.cartItemIds;
    const selectedCartItems = cart.items.filter(item =>
      cartItemIds.includes(item.id),
    );

    if (selectedCartItems.length === 0) {
      this.logger.error(`No valid cart items found for user ${userId}`);

      return handleError({
        defaultMessage: MESSAGES.INVALID_CART_ITEM,
        CustomException: BadRequestException,
      });
    }

    // Calculate total amount
    const totalAmount = selectedCartItems.reduce(
      (sum, item) => sum + Number(item.food.price) * item.quantity,
      0,
    );

    // Use a transaction to ensure data integrity
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create new order
      const order = new Order();
      order.userId = userId;
      order.totalAmount = totalAmount;
      order.status = OrderStatus.Pending;

      const savedOrder = await queryRunner.manager.save(order);

      // Create order items from selected cart items
      const orderItems = selectedCartItems.map(cartItem => {
        const orderItem = new OrderItem();
        orderItem.orderId = savedOrder.id;
        orderItem.foodId = cartItem.foodId;
        orderItem.quantity = cartItem.quantity;
        orderItem.totalAmount = Number(cartItem.food.price) * cartItem.quantity;

        return orderItem;
      });

      await queryRunner.manager.save(orderItems);

      // Remove the ordered items from cart
      const cartItemIds = selectedCartItems.map(item => item.id);
      await queryRunner.manager.delete(CartItem, cartItemIds);

      // Commit the transaction
      await queryRunner.commitTransaction();

      // Return the order with items
      const createdOrder = await this.ordersRepository.findOne({
        where: { id: savedOrder.id },
        relations: ['items', 'items.food'],
      });

      if (!createdOrder) {
        this.logger.error(`Order with id ${savedOrder.id} not found`);

        return handleError({
          defaultMessage: `Order with id ${savedOrder.id} not found`,
          CustomException: NotFoundException,
        });
      }

      this.logger.log(`Order created for user ${userId}`);

      return createdOrder;
    } catch (error: unknown) {
      this.logger.error(`Error creating order: ${JSON.stringify(error)}`);

      // Rollback the transaction in case of error
      await queryRunner.rollbackTransaction();

      return handleError({
        error,
        defaultMessage: MESSAGES.CREATE_ORDER_FAILED,
      });
    } finally {
      this.logger.log(`Releasing query runner for user ${userId}`);

      // Release the query runner
      await queryRunner.release();
    }
  }

  /**
   * Retrieves all orders with their items and associated food details
   *
   * @returns {Promise<OrdersResponseDto>} Array of orders with nested relations
   * @throws {InternalServerErrorException} When database query fails
   */
  async findAll(
    orderQueryParamsDto: OrderQueryParamsDto,
  ): Promise<OrdersResponseDto> {
    try {
      const { page, limit, sortBy, order } = orderQueryParamsDto;

      // Pagination and sort query
      const query = {
        page,
        limit,
        sortBy,
        order,
      };

      this.logger.log(`Fetching orders with query: ${JSON.stringify(query)}`);

      // Select fields to return
      const queryBuilder = this.ordersRepository.createQueryBuilder('entity');

      // Apply sorting
      if (sortBy && order) {
        applySort(queryBuilder, query);
      }

      const orders = await paginate(queryBuilder, query);

      this.logger.log(
        `Orders fetched successfully with query: ${JSON.stringify(query)}`,
      );

      return orders;
    } catch (error) {
      this.logger.error(`Error finding orders: ${JSON.stringify(error)}`);

      return handleError({
        error,
        defaultMessage: MESSAGES.FIND_ORDERS_FAILED,
      });
    }
  }

  /**
   * Retrieves a specific order by ID and user ID
   *
   * @param {string} userId - ID of the user who owns the order
   * @param {string} id - Unique identifier of the order
   * @returns {Promise<Order>} Order with nested items and food details
   * @throws {NotFoundException} When order is not found
   * @throws {InternalServerErrorException} When database query fails
   */
  async findById(userId: string, id: string): Promise<Order> {
    try {
      this.logger.log(`Finding order with id ${id} for user ${userId}`);

      const order = await this.ordersRepository.findOne({
        where: { id, userId },
        relations: ['items', 'items.food'],
      });

      if (!order) {
        this.logger.error(`Order with id ${id} not found for user ${userId}`);

        return handleError({
          defaultMessage: MESSAGES.ORDER_NOT_FOUND,
          CustomException: NotFoundException,
        });
      }

      this.logger.log(`Order with id ${id} found for user ${userId}`);

      return order;
    } catch (error) {
      this.logger.error(`Error finding order: ${JSON.stringify(error)}`);

      return handleError({
        error,
        defaultMessage: MESSAGES.GET_ORDER_FAILED,
      });
    }
  }

  /**
   * Retrieves all orders for a specific user
   *
   * @param {string} userId - ID of the user whose orders to find
   * @param {OrderQueryParamsDto} orderQueryParamsDto - Query parameters for pagination and sorting
   * @returns {Promise<OrdersResponseDto>} Array of user's orders with nested items and food details
   * @throws {InternalServerErrorException} When database query fails
   */
  async findUserOrders(
    userId: string,
    orderQueryParamsDto: OrderQueryParamsDto,
  ): Promise<OrdersResponseDto> {
    try {
      const { page, limit, sortBy, order } = orderQueryParamsDto;

      // Pagination and sort query
      const query = {
        page,
        limit,
        sortBy,
        order,
      };

      this.logger.log(`Fetching orders with query: ${JSON.stringify(query)}`);

      // Select fields to return
      const queryBuilder = this.ordersRepository
        .createQueryBuilder('entity')
        .where('entity.userId = :userId', { userId });

      // Apply sorting
      if (sortBy && order) {
        applySort(queryBuilder, query);
      }

      const orders = await paginate(queryBuilder, query);

      this.logger.log(
        `Orders fetched successfully with query: ${JSON.stringify(query)}`,
      );

      return orders;
    } catch (error) {
      this.logger.error(
        `Error finding orders for user ${userId}: ${JSON.stringify(error)}`,
      );

      return handleError({
        error,
        defaultMessage: MESSAGES.FIND_ORDERS_FAILED,
      });
    }
  }
}
