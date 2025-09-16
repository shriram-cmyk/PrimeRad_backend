import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  int,
  text,
  boolean,
  timestamp,
  primaryKey,
  date,
  datetime,
  time,
  unique,
  longtext,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const tblAdmin = mysqlTable(
  'tbl_admin',
  {
    adminId: int('admin_id').autoincrement().notNull(),
    adminName: varchar('admin_name', { length: 50 }).notNull(),
    adminEmail: varchar('admin_email', { length: 100 }).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.adminId], name: 'tbl_admin_admin_id' }),
  ],
);
