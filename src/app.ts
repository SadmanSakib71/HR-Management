import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import attendanceRoutes from './modules/attendance/attendance.routes';
import authRoutes from './modules/auth/auth.routes';
import employeeRoutes from './modules/employees/employees.routes';
import reportRoutes from './modules/reports/reports.routes';

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req: Request, res: Response): void => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/reports', reportRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
