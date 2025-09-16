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

export const tblDicomObservationTitles = mysqlTable(
  'tbl_dicom_observation_titles',
  {
    dicomObservationTitlesId: int('dicom_observation_titles_id')
      .autoincrement()
      .notNull(),
    programId: int('program_id').notNull(),
    sessionId: int('session_id').notNull(),
    observationTitle1: varchar('observation_title1', { length: 500 }).default(
      'na',
    ),
    observationTitle2: varchar('observation_title2', { length: 500 }).default(
      'na',
    ),
    observationTitle3: varchar('observation_title3', { length: 500 }).default(
      'na',
    ),
    observationTitle4: varchar('observation_title4', { length: 500 }).default(
      'na',
    ),
    observationTitle5: varchar('observation_title5', { length: 500 }).default(
      'na',
    ),
    observationTitle6: varchar('observation_title6', { length: 500 }).default(
      'na',
    ),
    observationTitle7: varchar('observation_title7', { length: 500 }).default(
      'na',
    ),
    observationTitle8: varchar('observation_title8', { length: 500 }).default(
      'na',
    ),
    observationTitle9: varchar('observation_title9', { length: 500 }).default(
      'na',
    ),
    observationTitle10: varchar('observation_title10', { length: 500 }).default(
      'na',
    ),
    facultyObservation: text('faculty_observation'),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({
      columns: [table.dicomObservationTitlesId],
      name: 'tbl_dicom_observation_titles_dicom_observation_titles_id',
    }),
  ],
);
