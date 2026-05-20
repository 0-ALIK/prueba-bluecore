import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

type RequestTarget = 'body' | 'params' | 'query';

export function validate(schema: z.ZodSchema, target: RequestTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return next(result.error);
    }

    if (target === 'query') {
      (req as any).validatedQuery = result.data;
    } else {
      req[target] = result.data;
    }

    next();
  };
}