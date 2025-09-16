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

export const tblSessionstatus = mysqlTable(
  'tbl_sessionstatus',
  {
    sessionstatusId: int('sessionstatus_id').autoincrement().notNull(),
    sessionId: int('session_id').notNull(),
    regId: int('reg_id').notNull(),
    programType: mysqlEnum('program_type', ['0', '1']).notNull(),
    sessionType: int('session_type').default(0).notNull(),
    isZoom: mysqlEnum('is_zoom', ['0', '1']).notNull(),
    sessionStatus: mysqlEnum('session_status', ['2', '1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({
      columns: [table.sessionstatusId],
      name: 'tbl_sessionstatus_sessionstatus_id',
    }),
  ],
);
