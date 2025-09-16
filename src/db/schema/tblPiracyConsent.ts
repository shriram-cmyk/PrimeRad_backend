import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  int,
  text,
  boolean,
  datetime,
  primaryKey,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const tblPiracyConsent = mysqlTable(
  'tbl_piracy_consent',
  {
    id: int().autoincrement().notNull(),
    regId: int('reg_id').notNull(),
    createdDate: datetime('created_date', { mode: 'string' })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'tbl_piracy_consent_id' }),
  ],
);
