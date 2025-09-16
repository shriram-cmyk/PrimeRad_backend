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

export const tblFaculty = mysqlTable(
  'tbl_faculty',
  {
    facultyId: int('faculty_id').autoincrement().notNull(),
    facultyName: varchar('faculty_name', { length: 100 }).notNull(),
    facultyLocation: varchar('faculty_location', { length: 100 }),
    facultyCountry: varchar('faculty_country', { length: 50 }),
    facultyImage: varchar('faculty_image', { length: 100 }),
    facultyDescription: varchar('faculty_description', { length: 500 }),
    facultyEmail: varchar('faculty_email', { length: 100 }),
    facultyPassword: varchar('faculty_password', { length: 100 }),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({ columns: [table.facultyId], name: 'tbl_faculty_faculty_id' }),
  ],
);
