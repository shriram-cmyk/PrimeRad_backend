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

export const tblBatchModuleMap = mysqlTable(
  'tbl_batch_module_map',
  {
    batchModuleMapId: int('batch_module_map_id').autoincrement().notNull(),
    batchId: int('batch_id').notNull(),
    moduleId: int('module_id').notNull(),
    status: mysqlEnum(['0', '1']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.batchModuleMapId],
      name: 'tbl_batch_module_map_batch_module_map_id',
    }),
    unique('batch_id').on(table.batchId, table.moduleId),
  ],
);
