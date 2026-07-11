import Joi, { ObjectSchema } from 'joi';
import { LoginRequestBody } from './auth.types';

export const loginSchema: ObjectSchema<LoginRequestBody> = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
