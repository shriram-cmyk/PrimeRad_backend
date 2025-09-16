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

export const tblBlogComments = mysqlTable(
  'tbl_blog_comments',
  {
    id: int().autoincrement().notNull(),
    blogId: int('blog_id').notNull(),
    regId: int('reg_id').notNull(),
    comment: longtext().notNull(),
    createdDate: datetime('created_date', { mode: 'string' }),
    status: mysqlEnum(['0', '1']).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'tbl_blog_comments_id' }),
  ],
);
