import { Knex } from 'knex';
import { BaseRepository } from '../../common/utils/BaseRepository';
import { AttendanceRecord } from './attendance.types';

export class AttendanceRepository extends BaseRepository<AttendanceRecord> {
  constructor(db: Knex) {
    super(db, 'attendance');
  }
}
