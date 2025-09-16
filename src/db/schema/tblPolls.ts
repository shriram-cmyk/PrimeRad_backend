import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  int,
  text,
  boolean,
  datetime,
  timestamp,
  primaryKey,
} from 'drizzle-orm/mysql-core';

export const tblPolls = mysqlTable(
  'tbl_polls',
  {
    pollId: int('poll_id').autoincrement().notNull(),
    moduleId: int('module_id').notNull(),
    question: varchar({ length: 255 }).notNull(),
    startDatetime: datetime('start_datetime', { mode: 'string' }),
    endDatetime: datetime('end_datetime', { mode: 'string' }),
    status: mysqlEnum(['0', '1']).notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.pollId], name: 'tbl_polls_poll_id' }),
  ],
);
