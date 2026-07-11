import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { BaseController } from '../../common/utils/BaseController';
import { ReportService } from './reports.service';
import { AttendanceReportQuery } from './reports.types';

export class ReportController extends BaseController<ReportService> {
  constructor(service: ReportService) {
    super(service);
  }

  public getAttendanceReport = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // req.query is typed as Express's ParsedQs by default; the validate middleware
    // replaces it at runtime with the Joi-coerced AttendanceReportQuery shape, which
    // has no static overlap with ParsedQs, so an `unknown` bridge cast is required.
    const query = req.query as unknown as AttendanceReportQuery;
    const result = await this.service.getAttendanceReport(query);
    res.status(200).json(result);
  });
}
