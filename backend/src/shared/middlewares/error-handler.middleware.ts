import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error';

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      statusCode: 400,
      timestamp: new Date().toISOString(),
      message: 'Validation failed',
      errors: error.issues.map(issue => ({
        field: issue.path.join('.') || 'body',
        message: issue.message,
      })),
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      timestamp: new Date().toISOString(),
      message: error.message,
      errors: error.errors ?? null,
    });
  }

  if ((error as any).type === 'entity.parse.failed') {
    return res.status(400).json({
      statusCode: 400,
      timestamp: new Date().toISOString(),
      message: 'Invalid JSON format',
    });
  }

  console.error('Unexpected error:', error);
  
  return res.status(500).json({
    statusCode: 500,
    timestamp: new Date().toISOString(),
    message: 'Internal server error',
  });
}