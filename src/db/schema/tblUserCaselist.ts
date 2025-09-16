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

export const tblUserCaselist = mysqlTable(
  'tbl_user_caselist',
  {
    caseId: int('case_id').autoincrement().notNull(),
    programId: int('program_id').notNull(),
    batchId: int('batch_id').notNull(),
    moduleId: int('module_id').notNull(),
    userId: int('user_id').notNull(),
    caseName: varchar('case_name', { length: 150 }).notNull(),
    clinicalDetails: varchar('clinical_details', { length: 150 }).notNull(),
    description: longtext(),
    facultyApproval: mysqlEnum('faculty_approval', ['0', '1']).notNull(),
    saveOrSubmit: mysqlEnum('save_or_submit', ['0', '1']).notNull(),
    createdDate: datetime('created_date', { mode: 'string' }),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({ columns: [table.caseId], name: 'tbl_user_caselist_case_id' }),
  ],
);
