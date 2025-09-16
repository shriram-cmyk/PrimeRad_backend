import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  int,
  text,
  boolean,
  date,
  timestamp,
  datetime,
  primaryKey,
} from 'drizzle-orm/mysql-core';

export const tblPhases = mysqlTable(
  'tbl_phases',
  {
    phaseId: int('phase_id').autoincrement().notNull(),
    programId: int('program_id'),
    batchId: int('batch_id'),
    phaseName: varchar('phase_name', { length: 100 }).notNull(),
    phaseDescription: varchar('phase_description', { length: 500 }).notNull(),
    phaseImage: varchar('phase_image', { length: 100 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    phaseStartDate: date('phase_start_date', { mode: 'string' }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    phaseEndDate: date('phase_end_date', { mode: 'string' }),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({ columns: [table.phaseId], name: 'tbl_phases_phase_id' }),
  ],
);
