import { Knex } from 'knex';
import { BaseRepository } from '../../common/utils/BaseRepository';
import { Attendance, CreateAttendanceBody, UpdateAttendanceBody } from './attendance.types';

export interface AttendanceListParams {
  page: number;
  limit: number;
  employeeId?: number;
  date?: string;
  from?: string;
  to?: string;
}

export interface AttendanceListResult {
  data: Attendance[];
  total: number;
}

export class AttendanceRepository extends BaseRepository<
  Attendance,
  CreateAttendanceBody,
  UpdateAttendanceBody
> {
  constructor(db: Knex) {
    super(db, 'attendance');
  }

  public async findByEmployeeAndDate(
    employeeId: number,
    date: string,
  ): Promise<Attendance | undefined> {
    return this.table.where({ employee_id: employeeId, date }).first() as Promise<
      Attendance | undefined
    >;
  }

  // Named `list` (not `findAll`) to match the EmployeeRepository pattern: the base
  // class's `findAll` returns `Promise<TRecord[]>`, which a paginated `{data, total}`
  // shape can't covariantly override without a TS error, so a distinct method avoids
  // the class-hierarchy conflict while staying consistent with the employees module.
  public async list(params: AttendanceListParams): Promise<AttendanceListResult> {
    const { page, limit, employeeId, date, from, to } = params;
    const offset = (page - 1) * limit;

    const applyFilters = (query: Knex.QueryBuilder): Knex.QueryBuilder => {
      if (employeeId !== undefined) {
        query.where('employee_id', employeeId);
      }
      if (date) {
        query.where('date', date);
      } else if (from && to) {
        query.whereBetween('date', [from, to]);
      } else if (from) {
        query.where('date', '>=', from);
      } else if (to) {
        query.where('date', '<=', to);
      }
      return query;
    };

    const dataQuery = applyFilters(this.table)
      .select('*')
      .orderBy('date', 'desc')
      .limit(limit)
      .offset(offset) as Promise<Attendance[]>;

    const countQuery = applyFilters(this.table)
      .count<{ count: string }>('id as count')
      .first() as Promise<{ count: string } | undefined>;

    const [data, countRow] = await Promise.all([dataQuery, countQuery]);

    return {
      data,
      total: Number(countRow?.count ?? 0),
    };
  }
}
