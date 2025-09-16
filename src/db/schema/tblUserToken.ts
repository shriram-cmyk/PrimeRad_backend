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

export const tblUserToken = mysqlTable(
  'tbl_user_token',
  {
    userTokenId: int('user_token_id').autoincrement().notNull(),
    userId: int('user_id').notNull(),
    token: varchar({ length: 100 }).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({
      columns: [table.userTokenId],
      name: 'tbl_user_token_user_token_id',
    }),
  ],
);
