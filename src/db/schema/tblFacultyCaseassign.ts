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

export const tblFacultyCaseassign = mysqlTable(
  'tbl_faculty_caseassign',
  {
    id: int().autoincrement().notNull(),
    caseId: int('case_id').notNull(),
    assignedFaculty: int('assigned_faculty').notNull(),
    caseApprovedBy: varchar('case_approved_by', { length: 50 }),
    facultyStatus: mysqlEnum('faculty_status', ['0', '1']).notNull(),
    createdDate: datetime('created_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'tbl_faculty_caseassign_id' }),
  ],
);
