import { faker } from '@faker-js/faker';

import { CreateFoodDto } from '@/modules/foods/dtos/create-food.dto';
import { UpdateFoodDto } from '@/modules/foods/dtos/update-food.dto';
import { Food } from '@/modules/foods/entities/food.entity';

import { MOCK_DATE, MOCK_FOOD } from './constant.mock';

const { NOW } = MOCK_DATE;

/**
 * Generates food creation DTO for testing
 */
export const generateCreateFoodDto = (): CreateFoodDto => ({
  name: MOCK_FOOD.NAME,
  price: MOCK_FOOD.PRICE,
  description: MOCK_FOOD.DESCRIPTION,
  imageUrl: MOCK_FOOD.IMAGE_URL,
});

/**
 * Generates a mock food entity for testing
 */
export const generateFood = (): Food => ({
  ...generateCreateFoodDto(),
  id: MOCK_FOOD.ID,
  isDeleted: false,
  createdAt: NOW,
  updatedAt: NOW,
});

/**
 * Generates food update DTO for testing
 */
export const genereateUpdateFoodDto = (): UpdateFoodDto => ({
  name: faker.commerce.productName(),
  price: faker.number.int({ min: 1, max: 1000 }),
});
