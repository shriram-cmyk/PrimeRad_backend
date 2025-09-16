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

export const tblExtReferral = mysqlTable(
  'tbl_ext_referral',
  {
    id: int().autoincrement().notNull(),
    referralName: varchar('referral_name', { length: 100 }).notNull(),
    userIp: varchar('user_ip', { length: 50 }).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'tbl_ext_referral_id' })],
);
