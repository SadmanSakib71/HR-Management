import { NotFoundError } from '../../common/errors';
import { EmployeeRepository } from '../employees/employees.repository';
import { AttendanceRepository } from './attendance.repository';
import {
  Attendance,
  AttendanceListQuery,
  AttendanceListResponse,
  AttendanceUpsertResult,
  CreateAttendanceBody,
  UpdateAttendanceBody,
} from './attendance.types';

const POSTGRES_UNIQUE_VIOLATION_CODE = '23505';

interface PostgresError extends Error {
  code?: string;
}

const isUniqueViolation = (error: unknown): boolean =>
  error instanceof Error && (error as PostgresError).code === POSTGRES_UNIQUE_VIOLATION_CODE;

export class AttendanceService {
  constructor(
    protected readonly repository: AttendanceRepository,
    protected readonly employeeRepository: EmployeeRepository,
  ) {}

  public async listAttendance(query: AttendanceListQuery): Promise<AttendanceListResponse> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const { data, total } = await this.repository.list({
      page,
      limit,
      employeeId: query.employee_id,
      date: query.date,
      from: query.from,
      to: query.to,
    });

    return { data, total, page, limit };
  }

  public async getAttendanceById(id: number): Promise<Attendance> {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new NotFoundError('Attendance record not found');
    }
    return record;
  }

  public async createOrUpsertAttendance(
    body: CreateAttendanceBody,
  ): Promise<AttendanceUpsertResult> {
    const employee = await this.employeeRepository.findById(body.employee_id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const existing = await this.repository.findByEmployeeAndDate(body.employee_id, body.date);
    if (existing) {
      return {
        record: await this.updateCheckInTime(existing.id, body.check_in_time),
        created: false,
      };
    }

    try {
      const created = await this.repository.create(body);
      return { record: created, created: true };
    } catch (error) {
      if (!isUniqueViolation(error)) {
        throw error;
      }

      // Race condition: another request inserted the same (employee_id, date)
      // between our pre-check and this insert. Fall back to an update instead
      // of letting the DB constraint violation bubble up as a raw 500.
      const raceExisting = await this.repository.findByEmployeeAndDate(body.employee_id, body.date);
      if (!raceExisting) {
        throw error;
      }
      return {
        record: await this.updateCheckInTime(raceExisting.id, body.check_in_time),
        created: false,
      };
    }
  }

  public async updateAttendance(id: number, body: UpdateAttendanceBody): Promise<Attendance> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Attendance record not found');
    }

    const updated = await this.repository.update(id, body);
    if (!updated) {
      throw new NotFoundError('Attendance record not found');
    }
    return updated;
  }

  public async deleteAttendance(id: number): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Attendance record not found');
    }
    await this.repository.delete(id);
  }

  private async updateCheckInTime(id: number, checkInTime: string): Promise<Attendance> {
    const updated = await this.repository.update(id, { check_in_time: checkInTime });
    if (!updated) {
      throw new NotFoundError('Attendance record not found');
    }
    return updated;
  }
}
