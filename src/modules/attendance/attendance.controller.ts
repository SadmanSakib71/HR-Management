import { Request, Response } from 'express';
import { ValidationError } from '../../common/errors';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { BaseController } from '../../common/utils/BaseController';
import { AttendanceService } from './attendance.service';
import {
  AttendanceListQuery,
  CreateAttendanceBody,
  UpdateAttendanceBody,
} from './attendance.types';

// Express 5 types route params as `string | string[]` (to support wildcard segments);
// a `:id` segment is always a single string at runtime, so we normalize defensively.
const parseId = (rawId: string | string[]): number => {
  const value = Array.isArray(rawId) ? rawId[0] : rawId;
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError(`Invalid attendance id: ${String(value)}`);
  }
  return id;
};

export class AttendanceController extends BaseController<AttendanceService> {
  constructor(service: AttendanceService) {
    super(service);
  }

  public list = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // req.query is typed as Express's ParsedQs by default; the validate middleware
    // replaces it at runtime with the Joi-coerced AttendanceListQuery shape, which
    // has no static overlap with ParsedQs, so an `unknown` bridge cast is required.
    const query = req.query as unknown as AttendanceListQuery;
    const result = await this.service.listAttendance(query);
    res.status(200).json(result);
  });

  public getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseId(req.params.id);
    const record = await this.service.getAttendanceById(id);
    res.status(200).json(record);
  });

  public createOrUpsert = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const body = req.body as CreateAttendanceBody;
    const { record, created } = await this.service.createOrUpsertAttendance(body);
    res.status(created ? 201 : 200).json(record);
  });

  public update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseId(req.params.id);
    const body = req.body as UpdateAttendanceBody;
    const record = await this.service.updateAttendance(id, body);
    res.status(200).json(record);
  });

  public remove = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseId(req.params.id);
    await this.service.deleteAttendance(id);
    res.status(204).send();
  });
}
