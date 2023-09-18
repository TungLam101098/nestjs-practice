/**
 * Custom HTTP Exception Class
 *
 * This class extends the built-in Error class (the base class in javascript) to create custom HTTP exceptions
 * with a specific status code and error message.
 *
 * @param {number} status - The HTTP status code associated with the exception.
 * @param {string} message - A descriptive error message.
 */
class HttpException extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export default HttpException;
