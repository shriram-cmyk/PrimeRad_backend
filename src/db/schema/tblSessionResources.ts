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

export const tblSessionResources = mysqlTable(
  'tbl_session_resources',
  {
    sessionResourceId: int('session_resource_id').autoincrement().notNull(),
    programId: int('program_id').notNull(),
    sessionId: int('session_id').notNull(),
    fileType: varchar('file_type', { length: 50 }).notNull(),
    displayname: varchar({ length: 100 }).notNull(),
    fileName: varchar('file_name', { length: 100 }),
    linkName: varchar('link_name', { length: 500 }),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({
      columns: [table.sessionResourceId],
      name: 'tbl_session_resources_session_resource_id',
    }),
  ],
);
