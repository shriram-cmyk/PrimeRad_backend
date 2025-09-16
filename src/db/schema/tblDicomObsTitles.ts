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

export const tblDicomObsTitles = mysqlTable(
  'tbl_dicom_obs_titles',
  {
    obsTitleId: int('obs_title_id').autoincrement().notNull(),
    programType: mysqlEnum('program_type', ['0', '1']).notNull(),
    programId: int('program_id'),
    batchId: int('batch_id'),
    phaseId: int('phase_id'),
    moduleId: int('module_id'),
    sessionId: int('session_id'),
    observationTitle: text('observation_title'),
    facultyObservation: longtext('faculty_observation'),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.obsTitleId],
      name: 'tbl_dicom_obs_titles_obs_title_id',
    }),
  ],
);
