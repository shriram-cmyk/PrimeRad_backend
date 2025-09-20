import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  int,
  text,
  boolean,
  timestamp,
  date,
  primaryKey,
  datetime,
} from 'drizzle-orm/mysql-core';

export const tblProgram = mysqlTable(
  'tbl_program',
  {
    programId: int('program_id').autoincrement().notNull(),
    programName: varchar('program_name', { length: 500 }).notNull(),
    programShortname: varchar('program_shortname', { length: 50 }).notNull(),
    programUrl: varchar('program_url', { length: 500 }).notNull(),
    redirectUrl: varchar('redirect_url', { length: 100 }).notNull(),
    programTitle: varchar('program_title', { length: 500 }),
    programDescription: varchar('program_description', { length: 500 }),
    programImage: varchar('program_image', { length: 255 }),
    programDuration: varchar('program_duration', { length: 20 }),
    salesPage: varchar('sales_page', { length: 500 }),
    // programType: varchar('program_type', { length: 500 }),
    adminEmail: varchar('admin_email', { length: 100 }),
    live: mysqlEnum(['Yes', 'No']).notNull(),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({ columns: [table.programId], name: 'tbl_program_program_id' }),
  ],
);
