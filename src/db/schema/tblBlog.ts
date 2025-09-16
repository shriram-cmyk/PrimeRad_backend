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

export const tblBlog = mysqlTable(
  'tbl_blog',
  {
    id: int().autoincrement().notNull(),
    moduleId: int('module_id').notNull(),
    tags: longtext(),
    blogTitle: varchar('blog_title', { length: 100 }).notNull(),
    blogDescription: longtext('blog_description').notNull(),
    blogImage: varchar('blog_image', { length: 255 }),
    urlSlug: varchar('url_slug', { length: 255 }),
    metaTitle: varchar('meta_title', { length: 255 }),
    metaDescription: longtext('meta_description'),
    viewCount: varchar('view_count', { length: 50 }).default('0').notNull(),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: datetime('created_date', { mode: 'string' })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'tbl_blog_id' })],
);
