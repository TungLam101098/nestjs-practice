import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

import { DateFormats } from '@/enums';

// Initialize dayjs with plugins
dayjs.extend(utc);

/**
 * Get current timestamp in ISO format
 *
 * @returns {string} Formatted timestamp in UTC
 */
export const getCurrentTimestamp = (): string =>
  dayjs().utc().format(DateFormats.IsoWithMilliseconds);
