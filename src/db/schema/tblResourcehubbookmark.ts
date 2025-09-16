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
  unique,
} from 'drizzle-orm/mysql-core';

export const tblResourcehubbookmark = mysqlTable(
  'tbl_resourcehubbookmark',
  {
    rhcBookmarkId: int('rhc_bookmark_id').autoincrement().notNull(),
    regId: int('reg_id').notNull(),
    resourcehubId: int('resourcehub_id'),
    resourcehubcontentId: int('resourcehubcontent_id'),
    bookmarkStatus: mysqlEnum('bookmark_status', ['1', '0']),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.rhcBookmarkId],
      name: 'tbl_resourcehubbookmark_rhc_bookmark_id',
    }),
    unique('unique_content_view').on(table.resourcehubcontentId, table.regId),
    unique('unique_view').on(table.resourcehubId, table.regId),
  ],
);
