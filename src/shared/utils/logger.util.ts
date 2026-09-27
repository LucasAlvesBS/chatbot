import { Logger } from '@nestjs/common';

export class AppLogger {
  private static instance: Logger;

  static getInstance(): Logger {
    if (!AppLogger.instance) {
      AppLogger.instance = new Logger('Application');
    }
    return AppLogger.instance;
  }

  static log(message: string, context?: string): void {
    const logger = context ? new Logger(context) : AppLogger.getInstance();
    logger.log(message);
  }

  static error(message: string, trace?: string, context?: string): void {
    const logger = context ? new Logger(context) : AppLogger.getInstance();
    logger.error(message, trace);
  }

  static warn(message: string, context?: string): void {
    const logger = context ? new Logger(context) : AppLogger.getInstance();
    logger.warn(message);
  }

  static debug(message: string, context?: string): void {
    const logger = context ? new Logger(context) : AppLogger.getInstance();
    logger.debug(message);
  }

  static verbose(message: string, context?: string): void {
    const logger = context ? new Logger(context) : AppLogger.getInstance();
    logger.verbose(message);
  }
}
