import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  int,
  text,
  boolean,
  datetime,
  primaryKey,
} from 'drizzle-orm/mysql-core';

export const tblUserCasefiles = mysqlTable(
  'tbl_user_casefiles',
  {
    id: int().autoincrement().notNull(),
    caseId: int('case_id').notNull(),
    fileType: varchar('file_type', { length: 50 }),
    fileName: varchar('file_name', { length: 255 }),
    fileViewname: varchar('file_viewname', { length: 255 }),
    status: mysqlEnum(['0', '1']).notNull(),
    createdDate: datetime('created_date', { mode: 'string' }),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'tbl_user_casefiles_id' }),
  ],
);
