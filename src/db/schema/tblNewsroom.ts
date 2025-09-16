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

export const tblNewsroom = mysqlTable(
  'tbl_newsroom',
  {
    id: int().autoincrement().notNull(),
    moduleId: int('module_id').notNull(),
    newroomTitle: varchar('newroom_title', { length: 255 }).notNull(),
    newroomImage: varchar('newroom_image', { length: 255 }),
    newsroomContent: longtext('newsroom_content').notNull(),
    reference: longtext(),
    status: mysqlEnum(['0', '1']).notNull(),
    createdDate: datetime('created_date', { mode: 'string' }).default(
      sql`(CURRENT_TIMESTAMP)`,
    ),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'tbl_newsroom_id' })],
);
