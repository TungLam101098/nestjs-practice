import { Test, TestingModule } from '@nestjs/testing';

import {
  generateCreateFoodDto,
  generateFood,
  genereateUpdateFoodDto,
  MOCK_DELETE_RESULT,
} from '@/mocks';

import { FoodsController } from '../foods.controller';
import { FoodsService } from '../foods.service';

describe('FoodsController', () => {
  let controller: FoodsController;
  let service: jest.Mocked<FoodsService>;

  // Mock food entity
  const mockFood = generateFood();

  beforeEach(async () => {
    const mockFoodsService = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodsController],
      providers: [
        {
          provide: FoodsService,
          useValue: mockFoodsService,
        },
      ],
    }).compile();

    controller = module.get<FoodsController>(FoodsController);
    service = module.get<FoodsService>(
      FoodsService,
    ) as jest.Mocked<FoodsService>;
  });

  describe('findAll', () => {
    it('should return an array of foods', async () => {
      // Arrange
      const expectedFoods = [mockFood];
      service.findAll.mockResolvedValue(expectedFoods);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual(expectedFoods);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a food by id', async () => {
      // Arrange
      service.findById.mockResolvedValue(mockFood);

      // Act
      const result = await controller.findById(mockFood.id);

      // Assert
      expect(result).toEqual(mockFood);
      expect(service.findById).toHaveBeenCalledWith(mockFood.id);
    });
  });

  describe('create', () => {
    it('should create a new food', async () => {
      // Arrange
      const createFoodDto = generateCreateFoodDto();
      service.create.mockResolvedValue(mockFood);

      // Act
      const result = await controller.create(createFoodDto);

      // Assert
      expect(result).toEqual(mockFood);
      expect(service.create).toHaveBeenCalledWith(createFoodDto);
    });
  });

  describe('update', () => {
    it('should update a food', async () => {
      // Arrange
      const updateFoodDto = genereateUpdateFoodDto();
      const updatedFood = { ...mockFood, ...updateFoodDto };
      service.update.mockResolvedValue(updatedFood);

      // Act
      const result = await controller.update(mockFood.id, updateFoodDto);

      // Assert
      expect(result).toEqual(updatedFood);
      expect(service.update).toHaveBeenCalledWith(mockFood.id, updateFoodDto);
    });
  });

  describe('delete', () => {
    it('should delete a food', async () => {
      // Arrange
      service.delete.mockResolvedValue(MOCK_DELETE_RESULT);

      // Act
      const result = await controller.delete(mockFood.id);

      // Assert
      expect(result).toEqual(MOCK_DELETE_RESULT);
      expect(service.delete).toHaveBeenCalledWith(mockFood.id);
    });
  });
});
