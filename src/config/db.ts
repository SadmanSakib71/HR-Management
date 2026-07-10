import knex, { Knex } from 'knex';
import { env } from './env';

const config: Knex.Config = {
  client: 'pg',
  connection: {
    connectionString: env.databaseUrl,
    ssl: { rejectUnauthorized: false },
  },
  pool: { min: 2, max: 10 },
};

export const db: Knex = knex(config);
