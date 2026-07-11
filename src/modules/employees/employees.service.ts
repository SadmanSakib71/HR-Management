import fs from 'fs/promises';
import path from 'path';
import { NotFoundError } from '../../common/errors';
import { env } from '../../config/env';
import { EmployeeRepository } from './employees.repository';
import {
  CreateEmployeeBody,
  Employee,
  EmployeeListQuery,
  EmployeeListResponse,
  UpdateEmployeeBody,
} from './employees.types';

const toStoredPhotoPath = (file: Express.Multer.File): string => `employees/${file.filename}`;

const deletePhotoFile = async (storedPhotoPath: string): Promise<void> => {
  const absolutePath = path.join(env.uploadDir, storedPhotoPath);
  try {
    await fs.unlink(absolutePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
};

export class EmployeeService {
  constructor(protected readonly repository: EmployeeRepository) {}

  public async listEmployees(query: EmployeeListQuery): Promise<EmployeeListResponse> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const { data, total } = await this.repository.list({ page, limit, search: query.search });

    return { data, total, page, limit };
  }

  public async getEmployeeById(id: number): Promise<Employee> {
    const employee = await this.repository.findById(id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }
    return employee;
  }

  public async createEmployee(
    body: CreateEmployeeBody,
    photoFile?: Express.Multer.File,
  ): Promise<Employee> {
    return this.repository.create({
      ...body,
      photo_path: photoFile ? toStoredPhotoPath(photoFile) : null,
    });
  }

  public async updateEmployee(
    id: number,
    body: UpdateEmployeeBody,
    photoFile?: Express.Multer.File,
  ): Promise<Employee> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Employee not found');
    }

    let photoPath = existing.photo_path;
    if (photoFile) {
      if (existing.photo_path) {
        await deletePhotoFile(existing.photo_path);
      }
      photoPath = toStoredPhotoPath(photoFile);
    }

    const updated = await this.repository.update(id, {
      ...body,
      photo_path: photoPath,
    });

    if (!updated) {
      throw new NotFoundError('Employee not found');
    }

    return updated;
  }

  public async deleteEmployee(id: number): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Employee not found');
    }
    await this.repository.softDelete(id);
  }
}
