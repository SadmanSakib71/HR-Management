import Joi, { ObjectSchema } from 'joi';
import { AttendanceReportQuery } from './reports.types';

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export const attendanceReportQuerySchema: ObjectSchema<AttendanceReportQuery> = Joi.object({
  month: Joi.string().pattern(MONTH_PATTERN).required().messages({
    'string.pattern.base': '"month" must be in YYYY-MM format',
  }),
  employee_id: Joi.number().integer().positive(),
});
