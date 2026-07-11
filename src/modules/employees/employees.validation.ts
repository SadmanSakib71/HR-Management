import Joi, { ObjectSchema } from 'joi';
import { CreateEmployeeBody, EmployeeListQuery, UpdateEmployeeBody } from './employees.types';

const MIN_EMPLOYEE_AGE = 18;
const MAX_EMPLOYEE_AGE = 70;

const calculateAge = (isoDateOfBirth: string): number => {
  const dob = new Date(isoDateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age;
};

const dateOfBirthSchema = Joi.string()
  .isoDate()
  .required()
  .custom((value: string, helpers) => {
    if (calculateAge(value) < MIN_EMPLOYEE_AGE) {
      return helpers.message({
        custom: `"date_of_birth" must result in an age of at least ${MIN_EMPLOYEE_AGE}`,
      });
    }
    return value;
  });

export const createEmployeeSchema: ObjectSchema<CreateEmployeeBody> = Joi.object({
  name: Joi.string().trim().min(1).max(255).required(),
  age: Joi.number().integer().min(MIN_EMPLOYEE_AGE).max(MAX_EMPLOYEE_AGE).required(),
  designation: Joi.string().trim().min(1).max(255).required(),
  hiring_date: Joi.string().isoDate().required(),
  date_of_birth: dateOfBirthSchema,
  salary: Joi.number().positive().required(),
});

export const updateEmployeeSchema: ObjectSchema<UpdateEmployeeBody> = Joi.object({
  name: Joi.string().trim().min(1).max(255),
  age: Joi.number().integer().min(MIN_EMPLOYEE_AGE).max(MAX_EMPLOYEE_AGE),
  designation: Joi.string().trim().min(1).max(255),
  hiring_date: Joi.string().isoDate(),
  date_of_birth: dateOfBirthSchema.optional(),
  salary: Joi.number().positive(),
}).min(1);

export const employeeListQuerySchema: ObjectSchema<EmployeeListQuery> = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().max(255),
});
