import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { MESSAGES } from '@/constants';
import { AuthenticatedRequest } from '@/interfaces';
import { Role } from '@/modules/users/enums/role.enum';
import { JoiValidationPipe, UuidValidationPipe } from '@/pipes';
import { PaginationSchema } from '@/schemas';

import { CreateOrderDto, CreateOrderSchema } from './dtos/create-order.dto';
import { OrderQueryParamsDto } from './dtos/order-query-params.dto';
import { OrdersResponseDto } from './dtos/orders-response.dto';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({
    summary:
      'Get current user orders with user role and get all orders with admin role',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User orders retrieved successfully',
    type: OrdersResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: MESSAGES.MISSING_TOKEN,
  })
  async findOrders(
    @Req() req: AuthenticatedRequest,
    @Query(new JoiValidationPipe(PaginationSchema))
    orderQueryParamsDto: OrderQueryParamsDto,
  ): Promise<OrdersResponseDto> {
    const { id, role } = req.user;

    // Admin can see all orders
    if (role === Role.Admin) {
      return await this.ordersService.findAll(orderQueryParamsDto);
    }

    // User can see only his orders
    return await this.ordersService.findUserOrders(id, orderQueryParamsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by id' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order found successfully',
    type: Order,
  })
  @ApiUnauthorizedResponse({
    description: MESSAGES.MISSING_TOKEN,
  })
  @ApiNotFoundResponse({
    description: MESSAGES.ORDER_NOT_FOUND,
  })
  async findById(
    @Req() req: AuthenticatedRequest,
    @Param('id', UuidValidationPipe) id: string,
  ): Promise<Order> {
    const userId = req.user.id;

    return await this.ordersService.findById(userId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new order from cart' })
  @ApiBody({
    type: CreateOrderDto,
    description: 'Order creation data',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Order created successfully',
    type: Order,
  })
  @ApiBadRequestResponse({
    description: MESSAGES.VALIDATE_FAILED,
  })
  @ApiUnauthorizedResponse({
    description: MESSAGES.MISSING_TOKEN,
  })
  @ApiNotFoundResponse({
    description: MESSAGES.CART_NOT_FOUND,
  })
  async createOrder(
    @Req() req: AuthenticatedRequest,
    @Body(new JoiValidationPipe(CreateOrderSchema))
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const userId = req.user.id;

    return await this.ordersService.createOrderFromCart(userId, createOrderDto);
  }
}
