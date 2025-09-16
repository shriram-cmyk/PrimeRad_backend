import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  int,
  text,
  boolean,
  timestamp,
  datetime,
  primaryKey,
} from 'drizzle-orm/mysql-core';

export const tblResourcehubcontent = mysqlTable(
  'tbl_resourcehubcontent',
  {
    resourcehubcontentId: int('resourcehubcontent_id')
      .autoincrement()
      .notNull(),
    resourcehubId: int('resourcehub_id').notNull(),
    resourcehubcontentType: varchar('resourcehubcontent_type', { length: 100 }),
    resourcehubcontentTitle: varchar('resourcehubcontent_title', {
      length: 500,
    }),
    resourcehubcontentFile: varchar('resourcehubcontent_file', { length: 500 }),
    resourcehubcontentLink: varchar('resourcehubcontent_link', { length: 500 }),
    resourcehubcontentDescription: text('resourcehubcontent_description'),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({
      columns: [table.resourcehubcontentId],
      name: 'tbl_resourcehubcontent_resourcehubcontent_id',
    }),
  ],
);
