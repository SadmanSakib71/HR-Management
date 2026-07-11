export interface Employee extends Record<string, unknown> {
  id: number;
  name: string;
  age: number;
  designation: string;
  hiring_date: Date;
  date_of_birth: Date;
  // NUMERIC(12,2) columns are returned by node-postgres as strings, not numbers,
  // to avoid silent precision loss — this reflects the actual runtime shape.
  salary: string;
  photo_path: string | null;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateEmployeeBody {
  name: string;
  age: number;
  designation: string;
  hiring_date: string;
  date_of_birth: string;
  salary: number;
}

export type UpdateEmployeeBody = Partial<CreateEmployeeBody>;

export interface EmployeeListQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface EmployeeListResponse {
  data: Employee[];
  total: number;
  page: number;
  limit: number;
}

// Repository-level insert/update shapes: same public fields plus photo_path,
// which never arrives in the request body (it comes from the uploaded file).
export interface EmployeeInsertData extends CreateEmployeeBody {
  photo_path?: string | null;
}

export type EmployeeUpdateData = Partial<EmployeeInsertData>;
