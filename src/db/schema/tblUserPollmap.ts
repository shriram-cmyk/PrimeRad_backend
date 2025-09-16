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

export const tblUserPollmap = mysqlTable(
  'tbl_user_pollmap',
  {
    id: int().autoincrement().notNull(),
    regId: int('reg_id').notNull(),
    pollId: int('poll_id').notNull(),
    optionId: int('option_id').notNull(),
    createdDate: datetime('created_date', { mode: 'string' }),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'tbl_user_pollmap_id' })],
);
