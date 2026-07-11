import Joi, { ObjectSchema } from 'joi';
import {
  AttendanceListQuery,
  CreateAttendanceBody,
  UpdateAttendanceBody,
} from './attendance.types';

const CHECK_IN_TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

const notInFutureDateSchema = Joi.string()
  .isoDate()
  .required()
  .custom((value: string, helpers) => {
    const inputDate = new Date(value);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    if (inputDate.getTime() > endOfToday.getTime()) {
      return helpers.message({ custom: '"date" must not be in the future' });
    }
    return value;
  });

const checkInTimeSchema = Joi.string()
  .pattern(CHECK_IN_TIME_PATTERN)
  .message('"check_in_time" must match HH:mm or HH:mm:ss format');

export const createAttendanceSchema: ObjectSchema<CreateAttendanceBody> = Joi.object({
  employee_id: Joi.number().integer().positive().required(),
  date: notInFutureDateSchema,
  check_in_time: checkInTimeSchema.required(),
});

export const updateAttendanceSchema: ObjectSchema<UpdateAttendanceBody> = Joi.object({
  date: notInFutureDateSchema.optional(),
  check_in_time: checkInTimeSchema,
}).min(1);

export const attendanceListQuerySchema: ObjectSchema<AttendanceListQuery> = Joi.object({
  employee_id: Joi.number().integer().positive(),
  date: Joi.string().isoDate(),
  from: Joi.string().isoDate(),
  to: Joi.string().isoDate(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
}).custom((value: AttendanceListQuery, helpers) => {
  if (value.from && value.to && new Date(value.to).getTime() < new Date(value.from).getTime()) {
    return helpers.message({ custom: '"to" must not be before "from"' });
  }
  return value;
});
