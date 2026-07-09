import { Knex } from 'knex';
import { BaseRepository } from '../../common/utils/BaseRepository';
import { EmployeeRecord } from './employees.types';

export class EmployeeRepository extends BaseRepository<EmployeeRecord> {
  constructor(db: Knex) {
    super(db, 'employees');
  }
}
