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

export const tblBlogTags = mysqlTable(
  'tbl_blog_tags',
  {
    id: int().autoincrement().notNull(),
    tagName: varchar('tag_name', { length: 255 }).notNull(),
    createdDate: datetime('created_date', { mode: 'string' })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'tbl_blog_tags_id' })],
);
