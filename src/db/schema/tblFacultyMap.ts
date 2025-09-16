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

export const tblFacultyMap = mysqlTable(
  'tbl_faculty_map',
  {
    facultyMapId: int('faculty_map_id').autoincrement().notNull(),
    sessionId: int('session_id').notNull(),
    facultyId: int('faculty_id').notNull(),
    facultyType: varchar('faculty_type', { length: 100 }),
    status: mysqlEnum(['0', '1']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({
      columns: [table.facultyMapId],
      name: 'tbl_faculty_map_faculty_map_id',
    }),
  ],
);
