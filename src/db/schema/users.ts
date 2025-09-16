import { mysqlTable, varchar, int, serial } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  age: int('age'),
  password: varchar('password', { length: 256 }).notNull(),
  role: varchar('role', { length: 50 }).default('user'),
  refreshToken: varchar('refresh_token', { length: 512 }),
});
