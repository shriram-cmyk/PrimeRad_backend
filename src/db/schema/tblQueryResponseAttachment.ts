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
} from 'drizzle-orm/mysql-core';

export const tblQueryResponseAttachment = mysqlTable(
  'tbl_query_response_attachment',
  {
    queryResponseAttachmentId: int('query_response_attachment_id')
      .autoincrement()
      .notNull(),
    queryResponseId: int('query_response_id').notNull(),
    fileName: varchar('file_name', { length: 255 }).notNull(),
    displayName: varchar('display_name', { length: 255 }).notNull(),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.queryResponseAttachmentId],
      name: 'tbl_query_response_attachment_query_response_attachment_id',
    }),
  ],
);
