import { AppError } from './AppError';

export class UnauthorizedError extends AppError {
  public readonly statusCode = 401;

  constructor(message = 'Unauthorized', details?: unknown) {
    super(message, details);
  }
}
