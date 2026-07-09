import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const baseConnection = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const config: Record<string, Knex.Config> = {
  development: {
    client: 'pg',
    connection: baseConnection,
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
    connection: baseConnection,
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
