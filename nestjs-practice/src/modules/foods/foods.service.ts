import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MESSAGES } from '@/constants';
import {
  applyFilters,
  applySort,
  getSelectFields,
  handleError,
  paginate,
  updateEntity,
} from '@/utils';

import { FOOD_SELECT_FIELDS } from './configs/select-fields.config';
import { CreateFoodDto } from './dtos/create-food.dto';
import { DeleteFoodDto } from './dtos/delete-food.dto';
import { FoodQueryParamsDto } from './dtos/food-query-params.dto';
import { FoodsResponseDto } from './dtos/foods-response.dto';
import { UpdateFoodDto } from './dtos/update-food.dto';
import { Food } from './entities/food.entity';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food)
    private foodsRepository: Repository<Food>,
  ) {}

  // Add logger
  private readonly logger = new Logger(FoodsService.name);

  /**
   * Retrieves all food items from the database
   * Returns an array of Food entities
   */
  async findAll(
    foodQueryParamsDto: FoodQueryParamsDto,
  ): Promise<FoodsResponseDto> {
    try {
      const { page, limit, sortBy, order, name } = foodQueryParamsDto;

      // Pagination and sort query
      const query = {
        page,
        limit,
        sortBy,
        order,
      };

      // Search fields
      const searchFields = {
        name,
      };

      this.logger.log(`Fetching foods with query: ${JSON.stringify(query)}`);

      // Select fields to return
      const selectFields = getSelectFields(FOOD_SELECT_FIELDS);
      const queryBuilder = this.foodsRepository
        .createQueryBuilder('entity')
        .select(selectFields.map(field => `entity.${field}`))
        .where('entity.isDeleted = :isDeleted', { isDeleted: false });

      // Apply filters
      if (name) {
        applyFilters(queryBuilder, searchFields);
      }

      // Apply sorting
      if (sortBy && order) {
        applySort(queryBuilder, query);
      }

      const foods = await paginate(queryBuilder, query);

      this.logger.log(
        `Foods fetched successfully with query: ${JSON.stringify(query)}`,
      );

      return foods;
    } catch (error: unknown) {
      this.logger.error(`Failed to fetch food items: ${JSON.stringify(error)}`);

      return handleError({
        error,
        defaultMessage: MESSAGES.GET_FOODS_FAILED,
      });
    }
  }

  /**
   * Retrieves a food item by its ID from the database
   *
   * @param {string} id - Unique identifier of the food item
   * @returns {Promise<Food>} Food entity if found
   * @throws {NotFoundException} When food item with given ID is not found
   */
  async findById(id: string): Promise<Food> {
    this.logger.log(`Fetching food item with ID ${id}`);

    // Find food item by id
    const food = await this.foodsRepository.findOne({
      where: { id, isDeleted: false },
    });

    // Throw an error if food is not found
    if (!food) {
      this.logger.error(`Food with ID ${id} not found`);

      return handleError({
        defaultMessage: `Food with ID ${id} not found`,
        CustomException: NotFoundException,
      });
    }

    this.logger.log(`Food with ID ${id} found`);

    return food;
  }

  /**
   * Creates a new food item in the database
   *
   * @param createFoodDto - Data transfer object containing food details
   * @returns Promise<Food> Newly created food entity
   * @throws Error when food creation fails
   */
  async create(createFoodDto: CreateFoodDto): Promise<Food> {
    try {
      this.logger.log(
        `Creating new food item: ${JSON.stringify(createFoodDto)}`,
      );

      const food = this.foodsRepository.create(createFoodDto);

      this.logger.log(
        `Saving new food item ${JSON.stringify(createFoodDto)} to the database`,
      );

      return await this.foodsRepository.save(food);
    } catch (error) {
      this.logger.error(`Failed to create food item: ${JSON.stringify(error)}`);

      return handleError({
        error,
        defaultMessage: MESSAGES.CREATE_FOOD_FAILED,
      });
    }
  }

  /**
   * Updates a food item in the database
   *
   * @param {string} id - Unique identifier of the food item to update
   * @param {UpdateFoodDto} updateFoodDto - Data transfer object containing updated food details
   * @returns {Promise<Food>} Updated food entity
   * @throws {NotFoundException} When food item with given id is not found
   * @throws {InternalServerErrorException} When database update fails
   */
  async update(id: string, updateFoodDto: UpdateFoodDto): Promise<Food> {
    try {
      this.logger.log(
        `Updating food item with ID ${id}: ${JSON.stringify(updateFoodDto)}`,
      );

      const food = await this.findById(id);
      this.foodsRepository.merge(food, updateFoodDto);

      this.logger.log(`Saving updated food item with ID ${id} to the database`);
      return await this.foodsRepository.save(food);
    } catch (error) {
      this.logger.error(
        `Failed to update food item with ID ${id}: ${JSON.stringify(error)}`,
      );

      return handleError({
        error,
        defaultMessage: MESSAGES.UPDATE_FOOD_FAILED,
      });
    }
  }

  async delete(id: string): Promise<DeleteFoodDto> {
    this.logger.log(`Deleting food item with ID ${id}`);

    // Check if food item exists
    const existingFood: Food | null = await this.foodsRepository.findOne({
      where: { id },
    });

    if (!existingFood) {
      this.logger.error(`Food with ID ${id} not found`);

      return handleError({
        defaultMessage: MESSAGES.FOOD_NOT_FOUND,
        CustomException: NotFoundException,
      });
    }

    try {
      // Prepare update payload
      const updatePayload = {
        isDeleted: true,
      } as UpdateFoodDto;
      const selectedFields = ['id'];

      // Update food using helper function
      const updatedFood = await updateEntity<Food, UpdateFoodDto, Food>(
        this.foodsRepository,
        id,
        updatePayload,
        selectedFields,
        MESSAGES.UPDATE_FOOD_FAILED,
      );

      this.logger.log(`Food item with ID ${id} deleted successfully`);

      return {
        success: true,
        id: updatedFood.id,
      };
    } catch (error: unknown) {
      this.logger.error(
        `Failed to delete food item with ID ${id}: ${JSON.stringify(error)}`,
      );

      return handleError({
        error,
        defaultMessage: MESSAGES.DELETE_FOOD_FAILED,
      });
    }
  }
}
