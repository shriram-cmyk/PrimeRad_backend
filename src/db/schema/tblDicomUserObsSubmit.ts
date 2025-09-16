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

export const tblDicomUserObsSubmit = mysqlTable(
  'tbl_dicom_user_obs_submit',
  {
    userObsSubmitId: int('user_obs_submit_id').autoincrement().notNull(),
    regId: int('reg_id').notNull(),
    sessionId: int('session_id').notNull(),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.userObsSubmitId],
      name: 'tbl_dicom_user_obs_submit_user_obs_submit_id',
    }),
  ],
);
