/**
 * @typedef {Object} ResponseMessage
 * @property {number} code - HTTP status code
 * @property {boolean} success - Success status
 * @property {string} message - Response message
 * @property {any} [data] - Optional response data
 */

/**
 * Default status codes for different response types
 */
const STATUS_CODES = {
  SUCCESS: 200,
  ERROR: 500
};

const serverResponse = {
  /**
   * Send success response
   * @param {import('express').Response} res - Express response object
   * @param {Object} message - Message object
   * @param {any} [data=null] - Optional response data
   * @returns {import('express').Response}
   */
  sendSuccess: (res, message, data = null) => {
    const responseMessage = {
      code: message.code || STATUS_CODES.SUCCESS,
      success: true,
      message: message.message
    };

    if (data !== null) {
      responseMessage.data = data;
    }

    return res.status(responseMessage.code).json(responseMessage);
  },

  /**
   * Send error response
   * @param {import('express').Response} res - Express response object
   * @param {Error & { code?: number }} error - Error object
   * @returns {import('express').Response}
   */
  sendError: (res, error) => {
    const responseMessage = {
      code: error.code || STATUS_CODES.ERROR,
      success: false,
      message: error.message || 'Internal Server Error'
    };

    return res.status(responseMessage.code).json(responseMessage);
  }
};

module.exports = serverResponse;
