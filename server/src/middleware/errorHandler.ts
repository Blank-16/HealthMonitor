import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';

export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${statusCode} - ${message}`);

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};
