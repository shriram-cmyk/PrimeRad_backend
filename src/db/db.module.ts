import { Module, OnModuleDestroy } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql, { PoolOptions } from 'mysql2/promise';
import * as schema from './schema/index';

const poolConfig: PoolOptions = {
  // socketPath: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
  host: process.env.DB_HOST || 'localhost',
  // Database credentials
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'vidocto@123',
  database: process.env.DB_NAME || 'vidocto_primemskfellowship',
  connectTimeout: 60000,
  // timeout: 30000,
  connectionLimit: 5,
  queueLimit: 0,
  charset: 'utf8mb4',
  // reconnect: true,
};

const poolConnection = mysql.createPool(poolConfig);

export const db = drizzle(poolConnection, {
  schema,
  mode: 'default',
});

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const connection = await poolConnection.getConnection();
    await connection.ping();
    connection.release();
    console.log('Database connection via socket successful');
    return true;
  } catch (error: any) {
    console.error('Database socket connection failed:', error.message);
    return false;
  }
};

@Module({
  providers: [
    {
      provide: 'DB',
      useValue: db,
    },
    {
      provide: 'DB_HEALTH_CHECK',
      useValue: checkDatabaseConnection,
    },
  ],
  exports: ['DB', 'DB_HEALTH_CHECK'],
})
export class DbModule implements OnModuleDestroy {
  async onModuleDestroy() {
    try {
      console.log('Closing database socket connections...');
      await poolConnection.end();
      console.log('Database socket connections closed successfully');
    } catch (error) {
      console.error('Error closing database socket connections:', error);
    }
  }
}
