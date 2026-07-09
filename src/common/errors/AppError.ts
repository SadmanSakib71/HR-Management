export abstract class AppError extends Error {
  public abstract readonly statusCode: number;
  public readonly isOperational: boolean = true;
  public readonly details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
