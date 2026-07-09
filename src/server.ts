import app from './app';
import { db } from './config/db';
import { env } from './config/env';

const startServer = async (): Promise<void> => {
  try {
    await db.raw('SELECT 1');
    console.log('Database connection established');

    app.listen(env.port, (): void => {
      console.log(`Server running on port ${env.port} [${env.nodeEnv}]`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

void startServer();
