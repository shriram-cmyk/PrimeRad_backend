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

export const tblQueryform = mysqlTable(
  'tbl_queryform',
  {
    scheduleformId: int('scheduleform_id').autoincrement().notNull(),
    programId: int('program_id'),
    batchId: int('batch_id'),
    name: varchar({ length: 100 }).notNull(),
    email: varchar({ length: 100 }).notNull(),
    mobile: varchar({ length: 50 }).notNull(),
    type: varchar({ length: 50 }).notNull(),
    message: varchar({ length: 1000 }),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.scheduleformId],
      name: 'tbl_queryform_scheduleform_id',
    }),
  ],
);
