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

export const tblBatchPhaseMap = mysqlTable(
  'tbl_batch_phase_map',
  {
    batchPhaseMapId: int('batch_phase_map_id').autoincrement().notNull(),
    batchId: int('batch_id').notNull(),
    phaseId: int('phase_id').notNull(),
    viewPhaseName: varchar('view_phase_name', { length: 50 }),
    status: mysqlEnum(['0', '1']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.batchPhaseMapId],
      name: 'tbl_batch_phase_map_batch_phase_map_id',
    }),
    unique('batch_id').on(table.batchId, table.phaseId),
  ],
);
