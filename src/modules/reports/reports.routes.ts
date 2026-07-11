import { Router } from 'express';
import { db } from '../../config/db';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { EmployeeRepository } from '../employees/employees.repository';
import { ReportController } from './reports.controller';
import { ReportRepository } from './reports.repository';
import { ReportService } from './reports.service';
import { attendanceReportQuerySchema } from './reports.validation';

const router = Router();

const reportRepository = new ReportRepository(db);
const employeeRepository = new EmployeeRepository(db);
const reportService = new ReportService(reportRepository, employeeRepository);
const reportController = new ReportController(reportService);

router.use(authenticate);

router.get(
  '/attendance',
  validate(attendanceReportQuerySchema, 'query'),
  reportController.getAttendanceReport,
);

export default router;
