import { MOCK_DATE } from '@/mocks';

import { getCurrentTimestamp } from '../date.util';

describe('DateUtil', () => {
  describe('getCurrentTimestamp', () => {
    const { NOW } = MOCK_DATE;

    // Mock the Date object before each test
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(NOW);
    });

    it('should return current timestamp in ISO format', () => {
      // Act
      const timestamp = getCurrentTimestamp();

      // Assert
      expect(timestamp).toBe(NOW.toISOString());
    });
  });
});
