import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema/index';

const poolConnection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'vidocto@123',
  database: process.env.DB_NAME || 'vidocto_primemskfellowship',
  connectTimeout: 10000,
});

export const db = drizzle(poolConnection, {
  schema,
  mode: 'default',
});

@Module({
  providers: [
    {
      provide: 'DB',
      useValue: db,
    },
  ],
  exports: ['DB'], // 👈 make DB available to other modules
})
export class DbModule {}
