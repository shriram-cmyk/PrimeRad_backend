import { Module, OnModuleDestroy } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql, { PoolOptions } from 'mysql2/promise';
import * as schema from './schema/index';

// Simple pool configuration that works with Cloud Run
const poolConfig: PoolOptions = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'vidocto@123',
  database: process.env.DB_NAME || 'vidocto_primemskfellowship',
  port: parseInt(process.env.DB_PORT || '3306'),

  // Critical timeout settings for Cloud Run
  connectTimeout: 60000,
  // timeout: 60000,

  // Pool settings optimized for serverless
  connectionLimit: 5, // Low connection count for Cloud Run
  queueLimit: 0,

  // Enable automatic reconnection
  // reconnect: true,

  // Charset
  charset: 'utf8mb4',
};

// Add SSL for production
if (process.env.NODE_ENV === 'production') {
  poolConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const poolConnection = mysql.createPool(poolConfig);

export const db = drizzle(poolConnection, {
  schema,
  mode: 'default',
});

// Health check function
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const connection = await poolConnection.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection check failed:', error);
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
      console.log('Closing database connections...');
      await poolConnection.end();
      console.log('Database connections closed successfully');
    } catch (error) {
      console.error('Error closing database connections:', error);
    }
  }
}
