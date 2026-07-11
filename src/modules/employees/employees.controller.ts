import { Request, Response } from 'express';
import { ValidationError } from '../../common/errors';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { BaseController } from '../../common/utils/BaseController';
import { EmployeeService } from './employees.service';
import { CreateEmployeeBody, EmployeeListQuery, UpdateEmployeeBody } from './employees.types';

// Express 5 types route params as `string | string[]` (to support wildcard segments);
// a `:id` segment is always a single string at runtime, so we normalize defensively.
const parseId = (rawId: string | string[]): number => {
  const value = Array.isArray(rawId) ? rawId[0] : rawId;
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError(`Invalid employee id: ${String(value)}`);
  }
  return id;
};

export class EmployeeController extends BaseController<EmployeeService> {
  constructor(service: EmployeeService) {
    super(service);
  }

  public list = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // req.query is typed as Express's ParsedQs by default; the validate middleware
    // replaces it at runtime with the Joi-coerced EmployeeListQuery shape, which
    // has no static overlap with ParsedQs, so an `unknown` bridge cast is required.
    const query = req.query as unknown as EmployeeListQuery;
    const result = await this.service.listEmployees(query);
    res.status(200).json(result);
  });

  public getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseId(req.params.id);
    const employee = await this.service.getEmployeeById(id);
    res.status(200).json(employee);
  });

  public create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const body = req.body as CreateEmployeeBody;
    const employee = await this.service.createEmployee(body, req.file);
    res.status(201).json(employee);
  });

  public update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseId(req.params.id);
    const body = req.body as UpdateEmployeeBody;
    const employee = await this.service.updateEmployee(id, body, req.file);
    res.status(200).json(employee);
  });

  public remove = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseId(req.params.id);
    await this.service.deleteEmployee(id);
    res.status(204).send();
  });
}
