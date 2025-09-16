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

export const tblUserCasecomment = mysqlTable(
  'tbl_user_casecomment',
  {
    commentId: int('comment_id').autoincrement().notNull(),
    caseId: int('case_id').notNull(),
    userId: varchar('user_id', { length: 50 }),
    facultyId: varchar('faculty_id', { length: 50 }),
    comment: longtext(),
    attachmentFile: varchar('attachment_file', { length: 255 }),
    viewFilename: varchar('view_filename', { length: 255 }),
    status: mysqlEnum(['0', '1']).notNull(),
    createdDate: datetime('created_date', { mode: 'string' }),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({
      columns: [table.commentId],
      name: 'tbl_user_casecomment_comment_id',
    }),
  ],
);
