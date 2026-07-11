import { Knex } from 'knex';
import { BaseRepository } from '../../common/utils/BaseRepository';
import { Employee, EmployeeInsertData, EmployeeUpdateData } from './employees.types';

export interface EmployeeListParams {
  page: number;
  limit: number;
  search?: string;
}

export interface EmployeeListResult {
  data: Employee[];
  total: number;
}

export class EmployeeRepository extends BaseRepository<
  Employee,
  EmployeeInsertData,
  EmployeeUpdateData
> {
  constructor(db: Knex) {
    super(db, 'employees');
  }

  public async findById(id: number | string): Promise<Employee | undefined> {
    return this.table.where({ id }).whereNull('deleted_at').first() as Promise<
      Employee | undefined
    >;
  }

  public async list(params: EmployeeListParams): Promise<EmployeeListResult> {
    const { page, limit, search } = params;
    const offset = (page - 1) * limit;

    const applyFilters = (query: Knex.QueryBuilder): Knex.QueryBuilder => {
      query.whereNull('deleted_at');
      if (search) {
        query.where('name', 'ilike', `%${search}%`);
      }
      return query;
    };

    const dataQuery = applyFilters(this.table)
      .select('*')
      .orderBy('id')
      .limit(limit)
      .offset(offset) as Promise<Employee[]>;

    const countQuery = applyFilters(this.table)
      .count<{ count: string }>('id as count')
      .first() as Promise<{ count: string } | undefined>;

    const [data, countRow] = await Promise.all([dataQuery, countQuery]);

    return {
      data,
      total: Number(countRow?.count ?? 0),
    };
  }

  public async softDelete(id: number): Promise<void> {
    await this.table.where({ id }).update({ deleted_at: this.db.fn.now() });
  }
}
