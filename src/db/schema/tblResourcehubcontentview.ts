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

export const tblResourcehubcontentview = mysqlTable(
  'tbl_resourcehubcontentview',
  {
    rhcViewId: int('rhc_view_id').autoincrement().notNull(),
    regId: int('reg_id').notNull(),
    resourcehubId: int('resourcehub_id'),
    resourcehubcontentId: int('resourcehubcontent_id'),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.rhcViewId],
      name: 'tbl_resourcehubcontentview_rhc_view_id',
    }),
    unique('unique_content_view').on(table.resourcehubcontentId, table.regId),
    unique('unique_view').on(table.resourcehubId, table.regId),
  ],
);
