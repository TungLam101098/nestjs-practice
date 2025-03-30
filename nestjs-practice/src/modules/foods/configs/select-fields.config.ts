import { FindOptionsSelect } from 'typeorm';

import { Food } from '../entities/food.entity';

/**
 * Configuration for food fields to be returned in responses
 * Excludes sensitive data like isDeleted
 */
export const FOOD_SELECT_FIELDS: FindOptionsSelect<Food> = {
  id: true,
  name: true,
  description: true,
  price: true,
  imageUrl: true,
  createdAt: true,
  updatedAt: true,
  isDeleted: false,
};
