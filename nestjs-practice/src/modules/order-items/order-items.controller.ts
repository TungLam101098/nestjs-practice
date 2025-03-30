import { Controller, Get, Param, Req, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { MESSAGES } from '@/constants';
import { AuthenticatedRequest } from '@/interfaces';
import { UuidValidationPipe } from '@/pipes';

import { OrderItem } from './entities/order-item.entity';
import { OrderItemsService } from './order-items.service';

@ApiTags('Order Items')
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get order item by id' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrderItem,
  })
  @ApiUnauthorizedResponse({
    description: MESSAGES.MISSING_TOKEN,
  })
  @ApiBadRequestResponse({
    description: MESSAGES.VALIDATE_FAILED,
  })
  @ApiNotFoundResponse({
    description: MESSAGES.ORDER_ITEM_NOT_FOUND,
  })
  async getOrderItemById(
    @Req() req: AuthenticatedRequest,
    @Param('id', UuidValidationPipe) id: string,
  ): Promise<OrderItem> {
    const userId = req.user.id;

    return await this.orderItemsService.getOrderItemById(userId, id);
  }
}
