import { SelectQueryBuilder } from 'typeorm';

import { SortOrder } from '@/enums';

import { applySort } from '../sort.util';

// Test entity interface
interface TestEntity {
  id: string;
  name: string;
  email: string;
}

describe('Sort Utils', () => {
  describe('applySort', () => {
    let mockQueryBuilder: jest.Mocked<SelectQueryBuilder<TestEntity>>;

    // Reset mock query builder before each test
    beforeEach(() => {
      mockQueryBuilder = {
        orderBy: jest.fn().mockReturnThis(),
      } as unknown as jest.Mocked<SelectQueryBuilder<TestEntity>>;
    });

    it('should apply ascending sort order by default', () => {
      // Arrange
      const sortOptions = { sortBy: 'name' };

      // Act
      applySort(mockQueryBuilder, sortOptions);

      // Assert
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'entity.name',
        'ASC',
      );
    });

    it('should apply specified ascending sort order', () => {
      // Arrange
      const sortOptions = { sortBy: 'email', order: SortOrder.Asc };

      // Act
      applySort(mockQueryBuilder, sortOptions);

      // Assert
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'entity.email',
        'ASC',
      );
    });

    it('should apply descending sort order', () => {
      // Arrange
      const sortOptions = { sortBy: 'id', order: SortOrder.Desc };

      // Act
      applySort(mockQueryBuilder, sortOptions);

      // Assert
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'entity.id',
        'DESC',
      );
    });
  });
});
