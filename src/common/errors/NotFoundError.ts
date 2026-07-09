import { AppError } from './AppError';

export class NotFoundError extends AppError {
  public readonly statusCode = 404;

  constructor(message = 'Resource not found', details?: unknown) {
    super(message, details);
  }
}
