import { AppError } from './AppError';

export class ValidationError extends AppError {
  public readonly statusCode = 422;

  constructor(message = 'Validation failed', details?: unknown) {
    super(message, details);
  }
}
