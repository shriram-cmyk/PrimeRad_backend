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

export const tblAnnouncementMap = mysqlTable(
  'tbl_announcement_map',
  {
    announcementMapId: int('announcement_map_id').autoincrement().notNull(),
    announcementId: int('announcement_id').notNull(),
    regId: int('reg_id').notNull(),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({
      columns: [table.announcementMapId],
      name: 'tbl_announcement_map_announcement_map_id',
    }),
  ],
);
