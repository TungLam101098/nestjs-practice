import { isEmptyObject, getSelectFields } from '../object.util';

describe('Object Utils', () => {
  describe('isEmptyObject', () => {
    it('should return true for null', () => {
      expect(isEmptyObject(null)).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isEmptyObject(undefined)).toBe(true);
    });

    it('should return true for empty object', () => {
      expect(isEmptyObject({})).toBe(true);
    });

    it('should return false for non-empty object', () => {
      const object = { key: 'value' };
      expect(isEmptyObject(object)).toBe(false);
    });

    it('should return false for object with multiple properties', () => {
      const object = { name: 'John', age: 30 };
      expect(isEmptyObject(object)).toBe(false);
    });
  });

  describe('getSelectFields', () => {
    it('should return empty array for empty object', () => {
      expect(getSelectFields({})).toEqual([]);
    });

    it('should return fields with true values', () => {
      const selectFields = {
        name: true,
        email: true,
        password: false,
      };
      expect(getSelectFields(selectFields)).toEqual(['name', 'email']);
    });

    it('should ignore fields with false values', () => {
      const selectFields = {
        id: false,
        name: false,
        email: true,
      };
      expect(getSelectFields(selectFields)).toEqual(['email']);
    });

    it('should handle all false values', () => {
      const selectFields = {
        id: false,
        name: false,
        email: false,
      };
      expect(getSelectFields(selectFields)).toEqual([]);
    });

    it('should handle all true values', () => {
      const selectFields = {
        id: true,
        name: true,
        email: true,
      };
      expect(getSelectFields(selectFields)).toEqual(['id', 'name', 'email']);
    });
  });
});
