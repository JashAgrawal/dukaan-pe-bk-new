import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

// Custom error class
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error status and message
  let statusCode = 500;
  let message = "Internal Server Error";
  let isOperational = false;

  // If it's our custom AppError, use its properties
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  } else if (err.name === "ValidationError") {
    // Mongoose validation error
    statusCode = 400;
    message = err.message;
    isOperational = true;
  } else if (err.name === "CastError") {
    // Mongoose cast error
    statusCode = 400;
    message = "Invalid ID format";
    isOperational = true;
  } else if (err.name === "JsonWebTokenError") {
    // JWT error
    statusCode = 401;
    message = "Invalid token. Please log in again.";
    isOperational = true;
  } else if (err.name === "TokenExpiredError") {
    // JWT expired
    statusCode = 401;
    message = "Your token has expired. Please log in again.";
    isOperational = true;
  }

  // Log error
  if (isOperational) {
    logger.warn(
      `${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
  } else {
    logger.error(`${err.stack}`);
  }

  // Send response
  res.status(statusCode).json({
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Catch async errors
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
