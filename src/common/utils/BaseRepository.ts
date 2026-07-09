import { Knex } from 'knex';

export abstract class BaseRepository<
  TRecord extends Record<string, unknown>,
  TCreateDTO = Partial<TRecord>,
  TUpdateDTO = Partial<TRecord>,
> {
  protected constructor(
    protected readonly db: Knex,
    protected readonly tableName: string,
  ) {}

  protected get table(): Knex.QueryBuilder {
    return this.db(this.tableName);
  }

  public async findAll(filters?: Partial<TRecord>): Promise<TRecord[]> {
    const query = this.table;
    if (filters) {
      void query.where(filters);
    }
    return query.select('*') as Promise<TRecord[]>;
  }

  public async findById(id: number | string): Promise<TRecord | undefined> {
    return this.table.where({ id }).first() as Promise<TRecord | undefined>;
  }

  public async findOne(filters: Partial<TRecord>): Promise<TRecord | undefined> {
    return this.table.where(filters).first() as Promise<TRecord | undefined>;
  }

  public async create(data: TCreateDTO): Promise<TRecord> {
    const [record] = (await this.table.insert(data).returning('*')) as TRecord[];
    return record;
  }

  public async update(id: number | string, data: TUpdateDTO): Promise<TRecord | undefined> {
    const [record] = (await this.table.where({ id }).update(data).returning('*')) as TRecord[];
    return record;
  }

  public async delete(id: number | string): Promise<number> {
    return this.table.where({ id }).del();
  }
}
