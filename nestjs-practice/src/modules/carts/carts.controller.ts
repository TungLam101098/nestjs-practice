import { Body, Controller, Get, HttpStatus, Post, Req } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { MESSAGES } from '@/constants';
import { AuthenticatedRequest } from '@/interfaces';
import { JoiValidationPipe } from '@/pipes';

import { CartsService } from './carts.service';
import { CreateCartDto, CreateCartSchema } from './dtos/create-cart.dto';
import { Cart } from './entities/cart.entity';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  @ApiOperation({ summary: 'Get cart for user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Cart,
  })
  @ApiUnauthorizedResponse({
    description: MESSAGES.MISSING_TOKEN,
  })
  async getUserCart(@Req() req: AuthenticatedRequest): Promise<Cart> {
    const userId = req.user.id;

    return await this.cartsService.getUserCart(userId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add items to cart' })
  @ApiBody({
    type: CreateCartDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Cart,
  })
  @ApiBadRequestResponse({
    description: MESSAGES.VALIDATE_FAILED,
  })
  @ApiUnauthorizedResponse({
    description: MESSAGES.MISSING_TOKEN,
  })
  @ApiNotFoundResponse({
    description: MESSAGES.FOOD_NOT_FOUND,
  })
  async addToCart(
    @Req() req: AuthenticatedRequest,
    @Body(new JoiValidationPipe(CreateCartSchema)) createCartDto: CreateCartDto,
  ): Promise<Cart> {
    const userId = req.user.id;

    return await this.cartsService.addToCart(userId, createCartDto);
  }
}
