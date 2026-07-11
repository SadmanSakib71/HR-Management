import { Router } from 'express';
import { db } from '../../config/db';
import { validate } from '../../middlewares/validate.middleware';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { loginSchema } from './auth.validation';

const router = Router();

const authService = new AuthService(db);
const authController = new AuthController(authService);

router.post('/login', validate(loginSchema), authController.login);

export default router;
