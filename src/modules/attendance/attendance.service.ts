import { AttendanceRepository } from './attendance.repository';

export class AttendanceService {
  constructor(protected readonly repository: AttendanceRepository) {}
}
