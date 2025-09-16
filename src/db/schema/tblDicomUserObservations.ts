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

export const tblDicomUserObservations = mysqlTable(
  'tbl_dicom_user_observations',
  {
    dicomUserObservationsId: int('dicom_user_observations_id')
      .autoincrement()
      .notNull(),
    dicomObservationTitlesId: int('dicom_observation_titles_id').notNull(),
    regId: int('reg_id').notNull(),
    moduleId: int('module_id').notNull(),
    sessionId: int('session_id').notNull(),
    observation1: varchar({ length: 1000 }).default('na'),
    observation2: varchar({ length: 1000 }).default('na'),
    observation3: varchar({ length: 1000 }).default('na'),
    observation4: varchar({ length: 1000 }).default('na'),
    observation5: varchar({ length: 1000 }).default('na'),
    observation6: varchar({ length: 1000 }).default('na'),
    observation7: varchar({ length: 1000 }).default('na'),
    observation8: varchar({ length: 1000 }).default('na'),
    observation9: varchar({ length: 1000 }).default('na'),
    observation10: varchar({ length: 1000 }).default('na'),
    saveSubmit: mysqlEnum('save_submit', ['1', '0']).notNull(),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({
      columns: [table.dicomUserObservationsId],
      name: 'tbl_dicom_user_observations_dicom_user_observations_id',
    }),
  ],
);
