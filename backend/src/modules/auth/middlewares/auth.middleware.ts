import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../services/jwt.service';
import { AppError } from '../../../shared/errors/app-error';

const jwtService = new JwtService();

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('No token provided', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwtService.verify(token);
    req.body.user = decoded;
    next();
  } catch {
    throw new AppError('Invalid token', 401);
  }
}
