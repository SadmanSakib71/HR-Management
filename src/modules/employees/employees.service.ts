import { EmployeeRepository } from './employees.repository';

export class EmployeeService {
  constructor(protected readonly repository: EmployeeRepository) {}
}
