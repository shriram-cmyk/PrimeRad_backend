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
} from 'drizzle-orm/mysql-core';

export const tblInsights = mysqlTable(
  'tbl_insights',
  {
    insightsId: int('insights_id').autoincrement().notNull(),
    regId: int('reg_id').notNull(),
    sessionId: int('session_id').notNull(),
    message: varchar({ length: 1000 }).notNull(),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    showStatus: mysqlEnum('show_status', ['1', '0']).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.insightsId],
      name: 'tbl_insights_insights_id',
    }),
  ],
);
