import { ReportRepository } from './reports.repository';

export class ReportService {
  constructor(protected readonly repository: ReportRepository) {}
}
