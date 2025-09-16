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
} from 'drizzle-orm/mysql-core';

export const tblQueries = mysqlTable(
  'tbl_queries',
  {
    queriesId: int('queries_id').autoincrement().notNull(),
    programId: int('program_id'),
    batchId: int('batch_id'),
    regId: int('reg_id').notNull(),
    moduleId: int('module_id'),
    sessionId: int('session_id'),
    anonymous: mysqlEnum(['1', '0']).notNull(),
    anonymousName: varchar('anonymous_name', { length: 50 }).notNull(),
    message: varchar({ length: 1000 }).notNull(),
    messagedetail: varchar({ length: 1000 }),
    likesCount: varchar('likes_count', { length: 10 }).default('0'),
    dislikesCount: varchar('dislikes_count', { length: 10 }).default('0'),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    showStatus: mysqlEnum('show_status', ['1', '0']).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.queriesId], name: 'tbl_queries_queries_id' }),
  ],
);
