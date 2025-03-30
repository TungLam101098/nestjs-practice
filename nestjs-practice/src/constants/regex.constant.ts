/**
 * Regular expression constants used throughout the application
 */
export const REGEX = {
  /**
   * UUID v4 format validation
   * Format: 8 chars-4 chars-4 chars-4 chars-12 chars
   */
  UUID: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,

  /**
   * Image URL format validation
   * Supports the following image formats: png, jpg, jpeg, gif, webp, svg
   */
  IMAGE_URL: /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg)(\?.*)?$/,

  /**
   * Password format validation
   * Must contain at least one uppercase letter, one lowercase letter, and one special character
   */
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]).+$/,
};
