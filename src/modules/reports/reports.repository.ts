import { Knex } from 'knex';
import { EmployeeAttendanceSummary } from './reports.types';

const LATE_THRESHOLD = '09:45:00';

export interface MonthlyAttendanceSummaryParams {
  startDate: string;
  endDate: string;
  employeeId?: number;
}

// Not extended from BaseRepository: reports aggregate across attendance + employees
// rather than mapping to a single CRUD table, so the generic CRUD contract doesn't apply.
export class ReportRepository {
  constructor(private readonly db: Knex) {}

  public async getMonthlyAttendanceSummary(
    params: MonthlyAttendanceSummaryParams,
  ): Promise<EmployeeAttendanceSummary[]> {
    const { startDate, endDate, employeeId } = params;

    const query = this.db('attendance as a')
      .join('employees as e', 'e.id', 'a.employee_id')
      .whereNull('e.deleted_at')
      .whereBetween('a.date', [startDate, endDate]);

    if (employeeId !== undefined) {
      query.where('a.employee_id', employeeId);
    }

    // Conditional aggregation (COUNT ... CASE WHEN) has no first-class Knex builder
    // method, so a raw expression is used here, as the task spec itself anticipates.
    // Casting to ::int avoids Postgres COUNT's default bigint-as-string return, so the
    // result already matches the `number` fields on EmployeeAttendanceSummary.
    const rows = (await query
      .groupBy('e.id', 'e.name')
      .orderBy('e.name')
      .select(
        'e.id as employee_id',
        'e.name as name',
        this.db.raw('COUNT(a.id)::int as days_present'),
        this.db.raw('COUNT(CASE WHEN a.check_in_time > ? THEN 1 END)::int as times_late', [
          LATE_THRESHOLD,
        ]),
      )) as EmployeeAttendanceSummary[];

    return rows;
  }
}
