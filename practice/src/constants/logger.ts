export default {
  /**
   * Default logging format configuration.
   * This format defines how HTTP request logs will be formatted.
   * - :method: HTTP request method (e.g., GET, POST).
   * - :url: Requested URL.
   * - :status: HTTP response status code.
   * - :res[content-length]: Content length of the response.
   * - :response-time: Time taken to process the request in milliseconds.
   */
  FORMAT: ':method :url :status :res[content-length] - :response-time ms',
};
