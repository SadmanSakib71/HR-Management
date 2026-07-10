import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const connection = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
};

const config: Record<string, Knex.Config> = {
  development: {
    client: 'pg',
    connection,
    migrations: {
      directory: './src/database/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/database/seeds',
      extension: 'ts',
    },
    pool: { min: 2, max: 10 },
  },

  production: {
    client: 'pg',
    connection,
    migrations: {
      directory: './src/database/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/database/seeds',
      extension: 'ts',
    },
    pool: { min: 2, max: 10 },
  },
};

export default config;
