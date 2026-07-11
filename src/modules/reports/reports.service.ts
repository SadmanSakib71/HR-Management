import { NotFoundError, ValidationError } from '../../common/errors';
import { EmployeeRepository } from '../employees/employees.repository';
import { ReportRepository } from './reports.repository';
import { AttendanceReportQuery, AttendanceReportResponse } from './reports.types';

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

const toISODate = (date: Date): string => date.toISOString().slice(0, 10);

// Day 0 of the following month is JS Date's built-in way of expressing "last day of
// this month" — it correctly handles 28/29/30/31-day months and leap years without
// any manual calendar logic.
const getMonthBoundaries = (month: string): { startDate: string; endDate: string } => {
  const [yearStr, monthStr] = month.split('-');
  const year = Number(yearStr);
  const monthIndex = Number(monthStr) - 1;

  const start = new Date(Date.UTC(year, monthIndex, 1));
  const end = new Date(Date.UTC(year, monthIndex + 1, 0));

  return { startDate: toISODate(start), endDate: toISODate(end) };
};

export class ReportService {
  constructor(
    protected readonly repository: ReportRepository,
    protected readonly employeeRepository: EmployeeRepository,
  ) {}

  public async getAttendanceReport(
    query: AttendanceReportQuery,
  ): Promise<AttendanceReportResponse> {
    if (!MONTH_PATTERN.test(query.month)) {
      throw new ValidationError('"month" must be in YYYY-MM format');
    }

    if (query.employee_id !== undefined) {
      const employee = await this.employeeRepository.findById(query.employee_id);
      if (!employee) {
        throw new NotFoundError('Employee not found');
      }
    }

    const { startDate, endDate } = getMonthBoundaries(query.month);

    const data = await this.repository.getMonthlyAttendanceSummary({
      startDate,
      endDate,
      employeeId: query.employee_id,
    });

    return { month: query.month, data };
  }
}
