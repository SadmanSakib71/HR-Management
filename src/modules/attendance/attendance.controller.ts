import { BaseController } from '../../common/utils/BaseController';
import { AttendanceService } from './attendance.service';

export class AttendanceController extends BaseController<AttendanceService> {
  constructor(service: AttendanceService) {
    super(service);
  }
}
