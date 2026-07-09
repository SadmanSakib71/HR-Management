import { Knex } from 'knex';
import { BaseRepository } from '../../common/utils/BaseRepository';
import { ReportRecord } from './reports.types';

export class ReportRepository extends BaseRepository<ReportRecord> {
  constructor(db: Knex) {
    super(db, 'reports');
  }
}
