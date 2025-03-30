import { SelectQueryBuilder } from 'typeorm';

import { VALIDATION_RULES } from '@/constants';

import { applyPagination, paginate } from '../pagination.util';

const { PAGINATION } = VALIDATION_RULES;

// Test entity interface
interface TestEntity {
  id: string;
  name: string;
}

describe('Pagination Utils', () => {
  let mockQueryBuilder: jest.Mocked<SelectQueryBuilder<TestEntity>>;

  // Reset mock query builder before each test
  beforeEach(() => {
    mockQueryBuilder = {
      skip: jest.fn(() => mockQueryBuilder),
      take: jest.fn(() => mockQueryBuilder),
      getManyAndCount: jest.fn(),
    } as unknown as jest.Mocked<SelectQueryBuilder<TestEntity>>;
  });

  describe('applyPagination', () => {
    it('should apply default pagination values when no query params provided', () => {
      // Arrange
      const query = {};

      // Act
      const result = applyPagination(
        mockQueryBuilder as SelectQueryBuilder<TestEntity>,
        query,
      );

      // Assert
      expect(result).toEqual({
        page: PAGINATION.CURRENT_PAGE.DEFAULT_VALUE,
        limit: PAGINATION.ITEMS_PER_PAGE.DEFAULT_VALUE,
      });
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(
        PAGINATION.ITEMS_PER_PAGE.DEFAULT_VALUE,
      );
    });

    it('should apply custom pagination values when provided', () => {
      // Arrange
      const query = { page: 2, limit: 15 };

      // Act
      const result = applyPagination(
        mockQueryBuilder as SelectQueryBuilder<TestEntity>,
        query,
      );

      // Assert
      expect(result).toEqual({
        page: 2,
        limit: 15,
      });
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(15);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(15);
    });
  });

  describe('paginate', () => {
    it('should return paginated response with correct metadata', async () => {
      // Arrange
      const query = { page: 2, limit: 10 };
      const mockData: TestEntity[] = [
        { id: '1', name: 'Test 1' },
        { id: '2', name: 'Test 2' },
      ];
      const totalItems = 25;

      (mockQueryBuilder.getManyAndCount as jest.Mock).mockResolvedValue([
        mockData,
        totalItems,
      ]);

      // Act
      const result = await paginate(mockQueryBuilder, query);

      // Assert
      expect(result).toEqual({
        data: mockData,
        metadata: {
          page: 2,
          limit: 10,
          total: totalItems,
          pageCount: 3,
        },
      });
    });

    it('should handle empty result set', async () => {
      // Arrange
      const query = { page: 1, limit: 10 };
      (mockQueryBuilder.getManyAndCount as jest.Mock).mockResolvedValue([
        [],
        0,
      ]);

      // Act
      const result = await paginate(mockQueryBuilder, query);

      // Assert
      expect(result).toEqual({
        data: [],
        metadata: {
          page: 1,
          limit: 10,
          total: 0,
          pageCount: 0,
        },
      });
    });

    it('should calculate pageCount correctly for partial pages', async () => {
      // Arrange
      const query = { page: 1, limit: 10 };
      const mockData: TestEntity[] = [{ id: '1', name: 'Test 1' }];
      const totalItems = 15;

      (mockQueryBuilder.getManyAndCount as jest.Mock).mockResolvedValue([
        mockData,
        totalItems,
      ]);

      // Act
      const result = await paginate(mockQueryBuilder, query);

      // Assert
      expect(result.metadata.pageCount).toBe(2);
    });
  });
});
