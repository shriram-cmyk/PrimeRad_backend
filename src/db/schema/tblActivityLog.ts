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

export const tblActivityLog = mysqlTable(
  'tbl_activity_log',
  {
    activityId: int('activity_id').autoincrement().notNull(),
    regId: varchar('reg_id', { length: 50 }),
    programId: varchar('program_id', { length: 50 }),
    batchId: varchar('batch_id', { length: 50 }),
    page: varchar({ length: 100 }),
    sessionId: varchar('session_id', { length: 100 }),
    ipAddress: varchar('ip_address', { length: 100 }),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.activityId],
      name: 'tbl_activity_log_activity_id',
    }),
  ],
);
