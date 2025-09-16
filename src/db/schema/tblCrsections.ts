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

export const tblCrsections = mysqlTable(
  'tbl_crsections',
  {
    crsectionId: int('crsection_id').autoincrement().notNull(),
    programId: int('program_id').notNull(),
    batchId: int('batch_id').notNull(),
    crsectionName: varchar('crsection_name', { length: 500 }).notNull(),
    crsectionDescription: text('crsection_description'),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.crsectionId],
      name: 'tbl_crsections_crsection_id',
    }),
  ],
);
