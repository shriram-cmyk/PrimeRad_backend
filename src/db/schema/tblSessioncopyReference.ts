import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  int,
  text,
  boolean,
  datetime,
  primaryKey,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const tblSessioncopyReference = mysqlTable(
  'tbl_sessioncopy_reference',
  {
    id: int().autoincrement().notNull(),
    oldSessionId: int('old_session_id').notNull(),
    newSessionId: int('new_session_id').notNull(),
    tableType: varchar('table_type', { length: 50 }).notNull(),
    status: mysqlEnum(['0', '1']).notNull(),
    createdDate: datetime('created_date', { mode: 'string' })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'tbl_sessioncopy_reference_id' }),
  ],
);
