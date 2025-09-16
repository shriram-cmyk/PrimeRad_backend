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

export const tblAnnouncement = mysqlTable(
  'tbl_announcement',
  {
    announcementId: int('announcement_id').autoincrement().notNull(),
    programId: int('program_id').notNull(),
    batchId: int('batch_id'),
    subject: varchar({ length: 250 }).notNull(),
    message: text(),
    sentStatus: mysqlEnum('sent_status', ['1', '0']).notNull(),
    sentDate: datetime('sent_date', { mode: 'string' }),
    sentNumber: int('sent_number'),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.announcementId],
      name: 'tbl_announcement_announcement_id',
    }),
  ],
);
