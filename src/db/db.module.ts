import { Module, OnModuleDestroy } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql, { PoolOptions } from 'mysql2/promise';
import * as schema from './schema/index';

// OPTIMIZED CONNECTION POOL CONFIGURATION
const poolConfig: PoolOptions = {
  // host: process.env.DB_HOST || '34.77.142.0',
  port: parseInt(process.env.DB_PORT || '3306'),

  // Fallback to socket if TCP fails
  socketPath: `/cloudsql/prime-prism-472312-f1:europe-west1:prime-backend-01`,

  // Database credentials
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Shri@0406',
  database: process.env.DB_NAME || 'vidocto_primemskfellowship',

  // CRITICAL PERFORMANCE SETTINGS
  connectionLimit: 20, // Increased from 5 to 20
  queueLimit: 0, // No queue limit (unlimited)
  connectTimeout: 60000, // Connection establishment timeout

  // Connection management
  idleTimeout: 300000, // 5 minutes idle timeout

  // Performance optimizations
  charset: 'utf8mb4',
  multipleStatements: false,
  supportBigNumbers: true,
  bigNumberStrings: false,
  dateStrings: false,
  debug: false,

  // SSL configuration for Cloud SQL (if needed)
  ssl:
    process.env.NODE_ENV === 'production'
      ? {
          rejectUnauthorized: false,
        }
      : undefined,

  // Enable compression for large data transfers
  compress: true,
};

// Alternative config for socket connection with optimizations
const socketPoolConfig: PoolOptions = {
  socketPath: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'vidocto@123',
  database: process.env.DB_NAME || 'vidocto_primemskfellowship',

  // OPTIMIZED SETTINGS FOR SOCKET CONNECTION
  connectionLimit: 25, // Higher for socket connections
  queueLimit: 50, // Some queue limit for socket
  connectTimeout: 30000, // Shorter connection timeout

  idleTimeout: 180000, // 3 minutes for socket

  charset: 'utf8mb4',
  compress: true,
  multipleStatements: false,
  supportBigNumbers: true,
  bigNumberStrings: false,
  dateStrings: false,
  debug: false,
};

// Choose config based on environment
const finalConfig =
  process.env.USE_SOCKET_CONNECTION === 'true' ? socketPoolConfig : poolConfig;

console.log('🔗 Database Config:', {
  connectionType:
    process.env.USE_SOCKET_CONNECTION === 'true' ? 'Socket' : 'TCP',
  connectionLimit: finalConfig.connectionLimit,
  host: finalConfig.host || 'socket',
  database: finalConfig.database,
});

const poolConnection = mysql.createPool(finalConfig);

// Enhanced Drizzle configuration
export const db = drizzle(poolConnection, {
  schema,
  mode: 'default',
  logger: process.env.NODE_ENV === 'development' ? true : false, // Enable query logging in dev
});

// Enhanced connection health check with performance monitoring
export const checkDatabaseConnection = async (): Promise<{
  isHealthy: boolean;
  connectionTime: number;
  poolStats: any;
}> => {
  const startTime = Date.now();

  try {
    // Get connection from pool
    const connection = await poolConnection.getConnection();
    const connectionTime = Date.now() - startTime;

    // Test query performance
    const queryStart = Date.now();
    await connection.execute('SELECT 1 as test');
    const queryTime = Date.now() - queryStart;

    // Release connection back to pool
    connection.release();

    // Get pool statistics
    const poolStats = {
      totalConnections: (poolConnection as any)._allConnections?.length || 0,
      freeConnections: (poolConnection as any)._freeConnections?.length || 0,
      connectionQueue: (poolConnection as any)._connectionQueue?.length || 0,
    };

    console.log('✅ Database Health Check:', {
      connectionTime: `${connectionTime}ms`,
      queryTime: `${queryTime}ms`,
      poolStats,
    });

    return {
      isHealthy: true,
      connectionTime,
      poolStats,
    };
  } catch (error: any) {
    const connectionTime = Date.now() - startTime;
    console.error('❌ Database Health Check Failed:', {
      error: error.message,
      connectionTime: `${connectionTime}ms`,
    });

    return {
      isHealthy: false,
      connectionTime,
      poolStats: {},
    };
  }
};

// Connection pool monitoring
export const getPoolStats = () => {
  const pool = poolConnection as any;
  return {
    totalConnections: pool._allConnections?.length || 0,
    freeConnections: pool._freeConnections?.length || 0,
    connectionQueue: pool._connectionQueue?.length || 0,
    acquiringConnections: pool._acquiringConnections?.length || 0,
  };
};

// Periodic health check (optional)
let healthCheckInterval: NodeJS.Timeout;

const startPeriodicHealthCheck = () => {
  healthCheckInterval = setInterval(async () => {
    const stats = getPoolStats();
    if (stats.freeConnections === 0 && stats.connectionQueue > 0) {
      console.warn('⚠️ Connection pool under pressure:', stats);
    }
  }, 30000); // Check every 30 seconds
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
    {
      provide: 'DB_POOL_STATS',
      useValue: getPoolStats,
    },
  ],
  exports: ['DB', 'DB_HEALTH_CHECK', 'DB_POOL_STATS'],
})
export class DbModule implements OnModuleDestroy {
  constructor() {
    // Start periodic monitoring in production
    if (process.env.NODE_ENV === 'production') {
      startPeriodicHealthCheck();
    }
  }

  async onModuleDestroy() {
    try {
      console.log('🔄 Closing database connections...');

      // Clear health check interval
      if (healthCheckInterval) {
        clearInterval(healthCheckInterval);
      }

      // Get final stats
      const finalStats = getPoolStats();
      console.log('📊 Final pool stats:', finalStats);

      // Close all connections
      await poolConnection.end();
      console.log('✅ Database connections closed successfully');
    } catch (error) {
      console.error('❌ Error closing database connections:', error);
    }
  }
}

// Usage in your fellowship service:
// constructor(
//   @Inject('DB') private db: typeof db,
//   @Inject('DB_POOL_STATS') private getPoolStats: typeof getPoolStats,
// ) {}
//
// // In your method, add this to monitor pool:
// const poolStats = this.getPoolStats();
// console.log('Pool stats before query:', poolStats);
