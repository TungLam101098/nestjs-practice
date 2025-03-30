import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { MESSAGES } from '@/constants';
import { Roles } from '@/decorators';
import { Role } from '@/modules/users/enums/role.enum';
import { JoiValidationPipe, UuidValidationPipe } from '@/pipes';

import { CreateFoodDto, CreateFoodSchema } from './dtos/create-food.dto';
import { DeleteFoodDto } from './dtos/delete-food.dto';
import {
  FoodQueryParamsDto,
  FoodQueryParamsSchema,
} from './dtos/food-query-params.dto';
import { FoodsResponseDto } from './dtos/foods-response.dto';
import { UpdateFoodDto, UpdateFoodSchema } from './dtos/update-food.dto';
import { Food } from './entities/food.entity';
import { FoodsService } from './foods.service';

@ApiTags('Foods')
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all foods' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all foods retrieved successfully',
    type: FoodsResponseDto,
  })
  @ApiBadRequestResponse({
    description: MESSAGES.VALIDATE_FAILED,
  })
  @ApiUnauthorizedResponse({
    description: MESSAGES.MISSING_TOKEN,
  })
  async findAll(
    @Query(new JoiValidationPipe(FoodQueryParamsSchema))
    foodQueryParamsDto: FoodQueryParamsDto,
  ): Promise<FoodsResponseDto> {
    return await this.foodsService.findAll(foodQueryParamsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get food by id' })
  @ApiParam({
    name: 'id',
    description: 'Food id',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Food found successfully',
    type: Food,
  })
  @ApiUnauthorizedResponse({
    description: MESSAGES.MISSING_TOKEN,
  })
  @ApiNotFoundResponse({
    description: MESSAGES.FOOD_NOT_FOUND,
  })
  async findById(@Param('id', UuidValidationPipe) id: string): Promise<Food> {
    return await this.foodsService.findById(id);
  }

  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create a new food (Admin only)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Food created successfully',
    type: Food,
  })
  @ApiBadRequestResponse({
    description: MESSAGES.VALIDATE_FAILED,
  })
  @ApiUnauthorizedResponse({
    description: MESSAGES.PERMISSION_DENIED,
  })
  async create(
    @Body(new JoiValidationPipe(CreateFoodSchema)) createFoodDto: CreateFoodDto,
  ): Promise<Food> {
    return await this.foodsService.create(createFoodDto);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update food by id (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Food id',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Food updated successfully',
    type: Food,
  })
  @ApiNotFoundResponse({
    description: MESSAGES.FOOD_NOT_FOUND,
  })
  @ApiUnauthorizedResponse({
    description: MESSAGES.PERMISSION_DENIED,
  })
  async update(
    @Param('id', UuidValidationPipe) id: string,
    @Body(new JoiValidationPipe(UpdateFoodSchema)) updateFoodDto: UpdateFoodDto,
  ): Promise<Food> {
    return await this.foodsService.update(id, updateFoodDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete food by id (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Food id',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Food deleted successfully',
    type: DeleteFoodDto,
  })
  @ApiNotFoundResponse({
    description: MESSAGES.FOOD_NOT_FOUND,
  })
  @ApiUnauthorizedResponse({
    description: MESSAGES.PERMISSION_DENIED,
  })
  async delete(
    @Param('id', UuidValidationPipe) id: string,
  ): Promise<DeleteFoodDto> {
    return await this.foodsService.delete(id);
  }
}
