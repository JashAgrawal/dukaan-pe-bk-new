import fs from 'fs';
import path from 'path';
import { StreamOptions } from 'morgan';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Get log level from environment or default to 'info'
const getLogLevel = () => {
  const env = process.env.NODE_ENV || 'development';
  const level = process.env.LOG_LEVEL || 'info';
  return env === 'development' ? 'debug' : level;
};

// Simple logger implementation
class Logger {
  private level: string;

  constructor() {
    this.level = getLogLevel();
  }

  private shouldLog(level: keyof typeof levels): boolean {
    return levels[level] <= levels[this.level as keyof typeof levels];
  }

  private logToFile(level: string, message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    
    // Log to console
    console.log(logMessage);
    
    // Log to file
    const logFile = path.join(logsDir, `${level}.log`);
    fs.appendFileSync(logFile, logMessage);
    
    // Also log errors and warnings to a combined log file
    if (level === 'error' || level === 'warn') {
      const combinedLogFile = path.join(logsDir, 'combined.log');
      fs.appendFileSync(combinedLogFile, logMessage);
    }
  }

  public error(message: string): void {
    if (this.shouldLog('error')) {
      this.logToFile('error', message);
    }
  }

  public warn(message: string): void {
    if (this.shouldLog('warn')) {
      this.logToFile('warn', message);
    }
  }

  public info(message: string): void {
    if (this.shouldLog('info')) {
      this.logToFile('info', message);
    }
  }

  public http(message: string): void {
    if (this.shouldLog('http')) {
      this.logToFile('http', message);
    }
  }

  public debug(message: string): void {
    if (this.shouldLog('debug')) {
      this.logToFile('debug', message);
    }
  }
}

// Create a stream object for Morgan
export const morganStream: StreamOptions = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Export logger instance
export const logger = new Logger();
