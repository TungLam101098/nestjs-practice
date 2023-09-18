/**
 * This function ensures that the provided value is an Error object.
 * If the provided value is not an Error object, it wraps it in a new Error object.
 * @param value - The value to ensure as an Error.
 * @returns An Error object.
 */
const ensureError = (value: unknown): Error => {
  if (value instanceof Error) {
    return value;
  }

  let errorMessage = 'Unable to stringify the thrown value';

  try {
    errorMessage = JSON.stringify(value);
  } catch {
    /* empty */
  }

  const error = new Error(`This value was thrown as is, not through an Error: ${errorMessage}`);
  return error;
};

export { ensureError };
