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

    req[target] = value;
    next();
  };
};
