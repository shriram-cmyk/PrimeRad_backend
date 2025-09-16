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

export const tblDicomUserObs = mysqlTable(
  'tbl_dicom_user_obs',
  {
    userObsId: int('user_obs_id').autoincrement().notNull(),
    obsTitleId: int('obs_title_id').notNull(),
    regId: int('reg_id').notNull(),
    userObs: longtext('user_obs'),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.userObsId],
      name: 'tbl_dicom_user_obs_user_obs_id',
    }),
    unique('obs_title_user').on(table.obsTitleId, table.regId),
  ],
);
