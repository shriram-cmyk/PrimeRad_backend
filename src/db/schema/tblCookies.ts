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

export const tblCookies = mysqlTable(
  'tbl_cookies',
  {
    cookieId: int('cookie_id').autoincrement().notNull(),
    regId: int('reg_id').notNull(),
    cookieValue: varchar('cookie_value', { length: 10 }).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.cookieId], name: 'tbl_cookies_cookie_id' }),
  ],
);
