import { NextFunction, Request, Response } from 'express';
import { AppError } from '../common/errors';
import { env } from '../config/env';

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(env.nodeEnv !== 'production' && { stack: err.stack }),
  });
};
