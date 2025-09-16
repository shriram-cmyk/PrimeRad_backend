import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  int,
  text,
  boolean,
  longtext,
  datetime,
  primaryKey,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const tblScholarship = mysqlTable(
  'tbl_scholarship',
  {
    id: int().autoincrement().notNull(),
    name: varchar({ length: 80 }).notNull(),
    email: varchar({ length: 120 }).notNull(),
    mobile: varchar({ length: 50 }).notNull(),
    country: varchar({ length: 50 }),
    highestDegree: varchar('highest_degree', { length: 120 }).notNull(),
    institution: varchar({ length: 120 }),
    yearRadiologist: varchar('year_radiologist', { length: 120 }).notNull(),
    applyReason: longtext('apply_reason').notNull(),
    careerImpact: longtext('career_impact'),
    cvFile: varchar('cv_file', { length: 255 }),
    createdDate: datetime('created_date', { mode: 'string' })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'tbl_scholarship_id' })],
);
