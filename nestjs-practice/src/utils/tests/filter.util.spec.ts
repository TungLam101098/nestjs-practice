import { SelectQueryBuilder } from 'typeorm';

import { applyFilters } from '../filter.util';

// Mock entity interface
interface TestEntity {
  id: string;
  name: string;
  email: string;
}

describe('Filter Utils', () => {
  describe('applyFilters', () => {
    let mockQueryBuilder: jest.Mocked<Partial<SelectQueryBuilder<TestEntity>>>;

    beforeEach(() => {
      mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
      };
    });

    it('should apply single filter correctly', () => {
      // Arrange
      const searchFields = { name: 'John' };

      // Act
      applyFilters(
        mockQueryBuilder as SelectQueryBuilder<TestEntity>,
        searchFields,
      );

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'entity.name ILIKE :name',
        { name: '%John%' },
      );
    });

    it('should apply multiple filters correctly', () => {
      // Arrange
      const searchFields = {
        name: 'John',
        email: 'john@example.com',
      };

      // Act
      applyFilters(
        mockQueryBuilder as SelectQueryBuilder<TestEntity>,
        searchFields,
      );

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(2);
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        1,
        'entity.name ILIKE :name',
        { name: '%John%' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        2,
        'entity.email ILIKE :email',
        { email: '%john@example.com%' },
      );
    });
  });
});
