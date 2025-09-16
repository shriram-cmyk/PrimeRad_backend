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

export const tblRefRegistration = mysqlTable(
  'tbl_ref_registration',
  {
    id: int().autoincrement().notNull(),
    regId: int('reg_id').notNull(),
    referrerNameCookie: varchar('referrer_name_cookie', { length: 100 }),
    referrerNameIp: varchar('referrer_name_ip', { length: 100 }),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'tbl_ref_registration_id' }),
  ],
);
