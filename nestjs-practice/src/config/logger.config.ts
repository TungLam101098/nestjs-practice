import { ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { Environment } from '@/enums';

export class CustomLogger extends ConsoleLogger {
  private logDir: string;
  private currentLogFile: string;

  // Maximum file size (20MB)
  private readonly MAX_FILE_SIZE_BYTES: number = 20 * 1024 * 1024;
  // Maximum log age (14 days)
  private readonly MAX_LOG_AGE_DAYS: number = 14;

  constructor() {
    super();
    this.logDir = process.env.LOG_DIR || path.join(process.cwd(), 'logs');
    this.ensureLogDirectoryExists();
    this.rotateLogFile();
    this.scheduleCleanup();
  }

  /**
   * Create logs directory if it doesn't exist
   */
  private ensureLogDirectoryExists(): void {
    try {
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true });
        console.log(`[LOGGER] Created logs directory: ${this.logDir}`);
      }
      // Verify write permissions
      fs.accessSync(this.logDir, fs.constants.W_OK);
    } catch (error) {
      console.error(`[LOGGER] Error accessing logs directory: ${error.message}`);
    }
  }

  /**
   * Create a new log file with current date
   */
  private rotateLogFile(): void {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    this.currentLogFile = path.join(this.logDir, `application-${formattedDate}.log`);
  }

  /**
   * Schedule periodic cleanup of old log files
   */
  private scheduleCleanup(): void {
    // Run cleanup daily at midnight
    const runCleanup = () => {
      const now = new Date();
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0
      );
      const timeUntilMidnight = midnight.getTime() - now.getTime();
      
      setTimeout(() => {
        this.cleanupOldLogFiles();
        // Schedule next cleanup
        runCleanup();
      }, timeUntilMidnight);
    };

    // Run initial cleanup
    this.cleanupOldLogFiles();
    // Schedule regular cleanup
    runCleanup();
  }

  /**
   * Remove log files older than MAX_LOG_AGE_DAYS
   */
  private cleanupOldLogFiles(): void {
    try {
      // Calculate cutoff date (14 days ago)
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.MAX_LOG_AGE_DAYS);
      
      // Get all log files
      const logFiles = fs.readdirSync(this.logDir)
        .filter(file => file.startsWith('application-') && file.endsWith('.log'));
      
      let deletedCount = 0;
      
      logFiles.forEach(file => {
        const filePath = path.join(this.logDir, file);
        
        try {
          const fileStats = fs.statSync(filePath);
          const fileDate = new Date(fileStats.mtime);
          
          // Delete if older than cutoff date
          if (fileDate < cutoffDate) {
            fs.unlinkSync(filePath);
            deletedCount++;
          }
        } catch (error) {
          console.error(`[LOGGER] Error processing file ${file}: ${error.message}`);
        }
      });
      
      if (deletedCount > 0) {
        console.log(`[LOGGER] Cleaned up ${deletedCount} log files older than ${this.MAX_LOG_AGE_DAYS} days`);
      }
    } catch (error) {
      console.error(`[LOGGER] Error during cleanup: ${error.message}`);
    }
  }

  /**
   * Check if current log file exceeds size limit and rotate if needed
   */
  private checkAndRotateLogFileSize(): void {
    try {
      if (fs.existsSync(this.currentLogFile)) {
        const stats = fs.statSync(this.currentLogFile);
        
        // Rotate if file size exceeds limit
        if (stats.size > this.MAX_FILE_SIZE_BYTES) {
          console.log(`[LOGGER] Log file reached ${(stats.size / (1024 * 1024)).toFixed(2)}MB, rotating...`);
          
          // Create new filename with timestamp to avoid conflicts
          const now = new Date();
          const timestamp = now.toISOString().replace(/[:.]/g, '-');
          const dateStr = now.toISOString().split('T')[0];
          const newFileName = path.join(
            this.logDir,
            `application-${dateStr}-${timestamp}.log`
          );
          
          // Rename current file to preserve logs
          fs.renameSync(this.currentLogFile, newFileName);
          
          // Create new log file
          this.rotateLogFile();
        }
      }
    } catch (error) {
      console.error(`[LOGGER] Error checking file size: ${error.message}`);
    }
  }

  /**
   * Write log message to file
   * @param message Log message content
   */
  private writeToFile(message: string): void {
    this.checkAndRotateLogFileSize();
    
    try {
      // Format message with timestamp
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] ${message}\n`;
      
      // Append to current log file
      fs.appendFileSync(this.currentLogFile, logMessage, 'utf8');
    } catch (error) {
      console.error(`[LOGGER] Error writing to log file: ${error.message}`);
    }
  }

  /**
   * Override standard log method
   */
  log(message: string, context?: string): void {
    super.log(message, context);
    this.writeToFile(`[INFO] ${context || 'Global'}: ${message}`);
  }

  /**
   * Override error log method
   */
  error(message: string, trace?: string, context?: string): void {
    super.error(message, trace, context);
    this.writeToFile(`[ERROR] ${context || 'Global'}: ${message}${trace ? `\n${trace}` : ''}`);
  }

  /**
   * Override warning log method
   */
  warn(message: string, context?: string): void {
    super.warn(message, context);
    this.writeToFile(`[WARN] ${context || 'Global'}: ${message}`);
  }

  /**
   * Override debug log method
   * Only writes to file in non-production environments
   */
  debug(message: string, context?: string): void {
    super.debug(message, context);
    if (process.env.NODE_ENV !== Environment.Production) {
      this.writeToFile(`[DEBUG] ${context || 'Global'}: ${message}`);
    }
  }

  /**
   * Override verbose log method
   */
  verbose(message: string, context?: string): void {
    super.verbose(message, context);
    this.writeToFile(`[VERBOSE] ${context || 'Global'}: ${message}`);
  }
}
