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

export const tblPasswordResetTemp = mysqlTable(
  'tbl_password_reset_temp',
  {
    resetId: int('reset_id').autoincrement().notNull(),
    email: varchar({ length: 100 }).notNull(),
    resetKey: varchar('reset_key', { length: 500 }).notNull(),
    expdate: datetime({ mode: 'string' }).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.resetId],
      name: 'tbl_password_reset_temp_reset_id',
    }),
  ],
);
