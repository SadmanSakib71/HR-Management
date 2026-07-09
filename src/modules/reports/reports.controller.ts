import { BaseController } from '../../common/utils/BaseController';
import { ReportService } from './reports.service';

export class ReportController extends BaseController<ReportService> {
  constructor(service: ReportService) {
    super(service);
  }
}
