import LOGGER from '@constants/logger';

type Logger = 'info' | 'error';

/**
 * Create a log string with the appropriate color and format
 * @param {String} color - the color of logger
 * @param {Logger} type - the type (e.g., info, error)
 * @param {String} message - the message to display
 * @returns {String} - message according to each type and color
 */
const getMessage = (color: string, type: Logger, message: string) =>
  `${color}[${type}]: ${message}\x1b[0m`;

/**
 * Create a new Logger
 */
const logger = {
  /**
   * Handle information logger
   * @param {String} message - the message to display
   */
  info(message: string) {
    console.log(getMessage(LOGGER.INFO_COLOR, 'info', message));
  },

  /**
   * Handle errors logger
   * @param {String} message - the message to display
   */
  error(message: string) {
    console.error(getMessage(LOGGER.ERROR_COLOR, 'error', message));
  },
};

export default logger;
