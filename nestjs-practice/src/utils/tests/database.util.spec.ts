import { InternalServerErrorException } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';

import { updateEntity } from '../database.util';

// Define interfaces for type safety
interface TestEntity {
  id: string;
  name?: string;
  email?: string;
  age?: number;
}

// Define mock query builder interface
interface MockQueryBuilder {
  update: jest.Mock;
  set: jest.Mock;
  where: jest.Mock;
  returning: jest.Mock;
  execute: jest.Mock;
}

describe('Database Utils', () => {
  describe('updateEntity', () => {
    let mockRepository: Partial<Repository<TestEntity>>;
    let mockQueryBuilder: MockQueryBuilder;

    // Reset mock repository and query builder before each test
    beforeEach(() => {
      // Create mock query builder with chaining methods
      mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn(),
      };

      // Create mock repository
      mockRepository = {
        target: 'TestEntity',
        createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      };
    });

    it('should successfully update and return entity', async () => {
      // Arrange
      const id = '123';
      const updatePayload = { name: 'Updated Name' };
      const selectFields = ['id', 'name'];
      const errorMessage = 'Update failed';
      const mockUpdatedEntity = { id: '123', name: 'Updated Name' };

      mockQueryBuilder.execute.mockResolvedValue({
        raw: [mockUpdatedEntity],
      } as UpdateResult);

      // Act
      const result = await updateEntity(
        mockRepository as Repository<TestEntity>,
        id,
        updatePayload,
        selectFields,
        errorMessage,
      );

      // Assert
      expect(result).toEqual(mockUpdatedEntity);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockQueryBuilder.update).toHaveBeenCalledWith('TestEntity');
      expect(mockQueryBuilder.set).toHaveBeenCalledWith(updatePayload);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('id = :id', { id });
      expect(mockQueryBuilder.returning).toHaveBeenCalledWith(selectFields);
    });

    it('should throw InternalServerErrorException when update fails', async () => {
      // Arrange
      const id = '123';
      const updatePayload = { name: 'Updated Name' };
      const selectFields = ['id', 'name'];
      const errorMessage = 'Update failed';

      // Mock query builder to return empty raw result
      mockQueryBuilder.execute.mockResolvedValue({
        raw: [],
      });

      // Act & Assert
      await expect(
        updateEntity(
          mockRepository as Repository<TestEntity>,
          id,
          updatePayload,
          selectFields,
          errorMessage,
        ),
      ).rejects.toThrow(InternalServerErrorException);

      await expect(
        updateEntity(
          mockRepository as Repository<TestEntity>,
          id,
          updatePayload,
          selectFields,
          errorMessage,
        ),
      ).rejects.toThrow(errorMessage);
    });
  });
});
