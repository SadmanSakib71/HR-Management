import { Router } from 'express';
import { db } from '../../config/db';
import { authenticate } from '../../middlewares/auth.middleware';
import { uploadEmployeePhoto } from '../../middlewares/upload.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { EmployeeController } from './employees.controller';
import { EmployeeRepository } from './employees.repository';
import { EmployeeService } from './employees.service';
import {
  createEmployeeSchema,
  employeeListQuerySchema,
  updateEmployeeSchema,
} from './employees.validation';

const router = Router();

const employeeRepository = new EmployeeRepository(db);
const employeeService = new EmployeeService(employeeRepository);
const employeeController = new EmployeeController(employeeService);

router.use(authenticate);

router.get('/', validate(employeeListQuerySchema, 'query'), employeeController.list);
router.get('/:id', employeeController.getById);
router.post('/', uploadEmployeePhoto, validate(createEmployeeSchema), employeeController.create);
router.put('/:id', uploadEmployeePhoto, validate(updateEmployeeSchema), employeeController.update);
router.delete('/:id', employeeController.remove);

export default router;
