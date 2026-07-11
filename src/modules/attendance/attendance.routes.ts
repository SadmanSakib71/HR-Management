import { Router } from 'express';
import { db } from '../../config/db';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { EmployeeRepository } from '../employees/employees.repository';
import { AttendanceController } from './attendance.controller';
import { AttendanceRepository } from './attendance.repository';
import { AttendanceService } from './attendance.service';
import {
  attendanceListQuerySchema,
  createAttendanceSchema,
  updateAttendanceSchema,
} from './attendance.validation';

const router = Router();

const attendanceRepository = new AttendanceRepository(db);
const employeeRepository = new EmployeeRepository(db);
const attendanceService = new AttendanceService(attendanceRepository, employeeRepository);
const attendanceController = new AttendanceController(attendanceService);

router.use(authenticate);

router.get('/', validate(attendanceListQuerySchema, 'query'), attendanceController.list);
router.get('/:id', attendanceController.getById);
router.post('/', validate(createAttendanceSchema), attendanceController.createOrUpsert);
router.put('/:id', validate(updateAttendanceSchema), attendanceController.update);
router.delete('/:id', attendanceController.remove);

export default router;
