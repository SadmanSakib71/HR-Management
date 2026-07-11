import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
import { ValidationError } from '../common/errors';

type ValidationTarget = 'body' | 'query' | 'params';

export const validate = (schema: ObjectSchema, target: ValidationTarget = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      next(
        new ValidationError(
          'Request validation failed',
          error.details.map((detail) => detail.message),
        ),
      );
      return;
    }

    if (target === 'query') {
      // Express 5 exposes `req.query` as a getter-only property, so a plain
      // assignment throws. Redefining it on the request instance shadows the
      // prototype getter and lets us swap in the Joi-coerced value.
      Object.defineProperty(req, 'query', { value, writable: true, configurable: true });
    } else {
      req[target] = value;
    }
    next();
  };
};
