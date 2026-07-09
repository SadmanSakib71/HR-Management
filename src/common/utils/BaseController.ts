import { Response } from 'express';

export abstract class BaseController<TService = unknown> {
  protected constructor(protected readonly service: TService) {}

  protected sendSuccess<T>(res: Response, data: T, statusCode = 200): Response {
    return res.status(statusCode).json({ success: true, data });
  }

  protected sendCreated<T>(res: Response, data: T): Response {
    return this.sendSuccess(res, data, 201);
  }

  protected sendNoContent(res: Response): Response {
    return res.status(204).send();
  }
}
