import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MESSAGES } from '@/constants';
import {
  generateCreateFoodDto,
  generateFood,
  genereateUpdateFoodDto,
  MOCK_DELETE_RESULT,
  MOCK_ERROR,
} from '@/mocks';
import { handleError } from '@/utils';

import { CreateFoodDto } from '../dtos/create-food.dto';
import { Food } from '../entities/food.entity';
import { FoodsService } from '../foods.service';

describe('FoodsService', () => {
  let service: FoodsService;
  let repository: jest.Mocked<Repository<Food>>;

  // Mock food entity
  const mockFood = generateFood();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodsService,
        {
          provide: getRepositoryToken(Food),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            merge: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FoodsService>(FoodsService);
    repository = module.get(getRepositoryToken(Food));
  });

  describe('findAll', () => {
    it('should return an array of foods', async () => {
      // Arrange
      const expectedFoods = [mockFood];
      repository.find.mockResolvedValue(expectedFoods);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(expectedFoods);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should handle errors in findAll', async () => {
      // Arrange
      repository.find.mockRejectedValue(MOCK_ERROR);
      jest.mocked(handleError).mockImplementation(() => {
        throw new InternalServerErrorException(MOCK_ERROR);
      });

      // Act & Assert
      await expect(service.findAll()).rejects.toThrow(MOCK_ERROR);
      expect(handleError).toHaveBeenCalledWith({
        error: MOCK_ERROR,
        defaultMessage: MESSAGES.GET_FOODS_FAILED,
      });
    });
  });

  describe('findById', () => {
    it('should return a food by id', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(mockFood);

      // Act
      const result = await service.findById(mockFood.id);

      // Assert
      expect(result).toEqual(mockFood);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockFood.id },
      });
    });

    it('should throw NotFoundException when food not found', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(null);
      jest.mocked(handleError).mockImplementation(() => {
        throw new NotFoundException(MOCK_ERROR);
      });

      // Act & Assert
      await expect(service.findById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new food', async () => {
      // Arrange
      const createFoodDto = generateCreateFoodDto();
      repository.create.mockReturnValue(mockFood);
      repository.save.mockResolvedValue(mockFood);

      // Act
      const result = await service.create(createFoodDto);

      // Assert
      expect(result).toEqual(mockFood);
      expect(repository.create).toHaveBeenCalledWith(createFoodDto);
      expect(repository.save).toHaveBeenCalledWith(mockFood);
    });

    it('should handle errors in create', async () => {
      // Arrange
      repository.save.mockRejectedValue(MOCK_ERROR);
      jest.mocked(handleError).mockImplementation(() => {
        throw new InternalServerErrorException(MOCK_ERROR);
      });

      // Act & Assert
      await expect(service.create({} as CreateFoodDto)).rejects.toThrow(
        MOCK_ERROR,
      );
      expect(handleError).toHaveBeenCalledWith({
        error: MOCK_ERROR,
        defaultMessage: MESSAGES.CREATE_FOOD_FAILED,
      });
    });
  });

  describe('update', () => {
    it('should update an existing food', async () => {
      // Arrange
      const updateFoodDto = genereateUpdateFoodDto();
      const updatedFood = { ...mockFood, ...updateFoodDto };
      repository.findOne.mockResolvedValue(mockFood);
      repository.merge.mockReturnValue(updatedFood);
      repository.save.mockResolvedValue(updatedFood);

      // Act
      const result = await service.update(mockFood.id, updateFoodDto);

      // Assert
      expect(result).toEqual(updatedFood);
      expect(repository.merge).toHaveBeenCalledWith(mockFood, updateFoodDto);
    });

    it('should throw NotFoundException when updating non-existent food', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(null);
      jest.mocked(handleError).mockImplementation(() => {
        throw new NotFoundException(MOCK_ERROR);
      });

      // Act & Assert
      await expect(
        service.update('non-existent-id', { price: 60 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an existing food', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(mockFood);
      repository.delete.mockResolvedValue(MOCK_DELETE_RESULT);

      // Act
      const result = await service.delete(mockFood.id);

      // Assert
      expect(result.affected).toBe(MOCK_DELETE_RESULT.affected);
      expect(repository.delete).toHaveBeenCalledWith(mockFood.id);
    });

    it('should throw NotFoundException when deleting non-existent food', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(null);
      jest.mocked(handleError).mockImplementation(() => {
        throw new NotFoundException(MOCK_ERROR);
      });

      // Act & Assert
      await expect(service.delete('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
