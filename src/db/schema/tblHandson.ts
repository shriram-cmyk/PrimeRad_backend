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

export const tblHandson = mysqlTable(
  'tbl_handson',
  {
    handsonId: int('handson_id').autoincrement().notNull(),
    centerName: varchar('center_name', { length: 100 }).notNull(),
    location: varchar({ length: 100 }).notNull(),
    mapAddress: longtext('map_address'),
    status: mysqlEnum(['0', '1']).notNull(),
    createdDate: datetime('created_date', { mode: 'string' })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.handsonId], name: 'tbl_handson_handson_id' }),
  ],
);
