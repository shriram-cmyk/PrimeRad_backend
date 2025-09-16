import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  int,
  text,
  boolean,
  timestamp,
  datetime,
  primaryKey,
} from 'drizzle-orm/mysql-core';

export const tblPollstatus = mysqlTable(
  'tbl_pollstatus',
  {
    sessionstatusId: int('sessionstatus_id').autoincrement().notNull(),
    pollId: int('poll_id').notNull(),
    regId: int('reg_id').notNull(),
    pollStatus: mysqlEnum('poll_status', ['2', '1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({
      columns: [table.sessionstatusId],
      name: 'tbl_pollstatus_sessionstatus_id',
    }),
  ],
);
