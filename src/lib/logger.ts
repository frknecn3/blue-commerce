/**
 * Production-Grade Structured Logger
 * 
 * In production environments (or when JSON_LOGS=true), outputs machine-readable JSON format
 * suitable for Datadog, CloudWatch, BetterStack, or Sentry ingestion.
 * In development, outputs human-readable formatted console messages with timestamps.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  userId?: string;
  requestId?: string;
  endpoint?: string;
  durationMs?: number;
  [key: string]: unknown;
}

class StructuredLogger {
  private isProduction = process.env.NODE_ENV === 'production';

  private formatMessage(level: LogLevel, message: string, context?: LogContext, error?: Error | unknown) {
    const timestamp = new Date().toISOString();

    if (this.isProduction || process.env.JSON_LOGS === 'true') {
      const logEntry: Record<string, unknown> = {
        timestamp,
        level: level.toUpperCase(),
        message,
        ...context,
      };

      if (error instanceof Error) {
        logEntry.error = {
          name: error.name,
          message: error.message,
          stack: error.stack,
        };
      } else if (error) {
        logEntry.error = error;
      }

      return JSON.stringify(logEntry);
    }

    // Dev friendly format
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `${prefix} ${message}${contextStr}`;
  }

  public info(message: string, context?: LogContext) {
    console.log(this.formatMessage('info', message, context));
  }

  public warn(message: string, context?: LogContext) {
    console.warn(this.formatMessage('warn', message, context));
  }

  public error(message: string, error?: Error | unknown, context?: LogContext) {
    console.error(this.formatMessage('error', message, context, error));
  }

  public debug(message: string, context?: LogContext) {
    if (process.env.DEBUG === 'true' || !this.isProduction) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }
}

export const logger = new StructuredLogger();
