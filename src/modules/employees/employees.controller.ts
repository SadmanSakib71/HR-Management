import { BaseController } from '../../common/utils/BaseController';
import { EmployeeService } from './employees.service';

export class EmployeeController extends BaseController<EmployeeService> {
  constructor(service: EmployeeService) {
    super(service);
  }
}
