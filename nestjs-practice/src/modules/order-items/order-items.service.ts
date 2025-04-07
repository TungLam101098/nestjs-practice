import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MESSAGES } from '@/constants';
import { handleError } from '@/utils';

import { OrdersService } from '../orders/orders.service';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private readonly ordersService: OrdersService,
  ) {}

  // Add logger
  private readonly logger = new Logger(OrderItemsService.name);

  /**
   * Retrieves an order item by ID with authorization check
   * Ensures users can only access their own order items
   *
   * @param userId - ID of the user requesting the order item
   * @param id - ID of the order item to retrieve
   * @returns Promise<OrderItem> Order item if authorized
   * @throws {ForbiddenException} If user doesn't own the order item
   * @throws {NotFoundException} If order item doesn't exist
   */
  async getOrderItemById(userId: string, id: string): Promise<OrderItem> {
    try {
      this.logger.log(`User ${userId} is requesting order item ${id}`);

      const orderItem: OrderItem | null =
        await this.orderItemsRepository.findOne({
          where: { id },
          relations: ['food'],
        });

      if (!orderItem) {
        this.logger.error(`Order item ${id} not found`);

        return handleError({
          defaultMessage: MESSAGES.ORDER_ITEM_NOT_FOUND,
          ExceptionClass: NotFoundException,
        });
      }

      const order = await this.ordersService.findById(
        userId,
        orderItem.orderId,
      );

      // Ensure user can only access their own order items
      if (order.userId !== userId) {
        this.logger.error(`User ${userId} doesn't own order item ${id}`);

        return handleError({
          defaultMessage: MESSAGES.PERMISSION_DENIED,
          ExceptionClass: ForbiddenException,
        });
      }

      this.logger.log(`Order item ${id} retrieved successfully`);

      return orderItem;
    } catch (error: unknown) {
      this.logger.error(
        `Failed to retrieve order item ${id} as user ${userId} with error: ${JSON.stringify(error)}`,
      );

      return handleError({
        error,
        defaultMessage: MESSAGES.GET_ORDER_ITEM_FAILED,
      });
    }
  }
}
