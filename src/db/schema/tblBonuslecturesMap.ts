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

export const tblBonuslecturesMap = mysqlTable(
  'tbl_bonuslectures_map',
  {
    id: int().autoincrement().notNull(),
    sessionId: int('session_id').notNull(),
    programId: int('program_id').notNull(),
    batchId: int('batch_id').notNull(),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: datetime('created_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'tbl_bonuslectures_map_id' }),
  ],
);
