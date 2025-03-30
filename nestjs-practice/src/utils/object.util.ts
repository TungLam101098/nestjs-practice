/**
 * Check if an object is empty
 *
 * @param value - The value to check
 * @typeParam T - The type of the value being checked
 * @returns `true` if the value is empty, `false` otherwise
 */
export const isEmptyObject = <T>(value: T): boolean => {
  return !value || Object.keys(value as Record<string, unknown>).length === 0;
};

/**
 * Converts a select fields configuration object to an array of field names
 *
 * @param selectFields - Object with field names as keys and boolean values
 * @returns Array of field names where the value is true
 */
export const getSelectFields = (
  selectFields: Record<string, boolean>,
): string[] =>
  Object.entries(selectFields)
    .filter(([, value]) => value)
    .map(([key]) => key);
