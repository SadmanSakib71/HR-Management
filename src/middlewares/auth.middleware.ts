import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../common/errors';
import { AuthenticatedUser } from '../common/types/express';
import { env } from '../config/env';

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or malformed Authorization header');
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, env.jwt.secret) as AuthenticatedUser;
    req.user = payload;
    next();
  } catch (error) {
    next(
      error instanceof UnauthorizedError
        ? error
        : new UnauthorizedError('Invalid or expired token'),
    );
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError('Not authenticated'));
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      next(new UnauthorizedError('Insufficient permissions'));
      return;
    }
    next();
  };
};
