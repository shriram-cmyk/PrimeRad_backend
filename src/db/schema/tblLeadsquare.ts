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

export const tblLeadsquare = mysqlTable(
  'tbl_leadsquare',
  {
    id: int().autoincrement().notNull(),
    fname: varchar({ length: 50 }),
    lname: varchar({ length: 50 }),
    designation: varchar({ length: 50 }),
    email: varchar({ length: 100 }),
    mobile: varchar({ length: 50 }),
    leadSource: mysqlEnum('lead_source', ['1', '2', '3', '4', '5', '6']),
    programId: varchar('program_id', { length: 50 }),
    batchId: varchar('batch_id', { length: 50 }),
    leadPage: varchar('lead_page', { length: 100 }).notNull(),
    status: mysqlEnum(['0', '1']).notNull(),
    createdDate: datetime('created_date', { mode: 'string' }).default(
      sql`(CURRENT_TIMESTAMP)`,
    ),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'tbl_leadsquare_id' })],
);
