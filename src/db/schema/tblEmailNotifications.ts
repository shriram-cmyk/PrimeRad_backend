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

export const tblEmailNotifications = mysqlTable(
  'tbl_email_notifications',
  {
    emailNotificationId: int('email_notification_id').autoincrement().notNull(),
    queryResponseId: int('query_response_id'),
    resourcehubcontentId: int('resourcehubcontent_id'),
    emailStatus: mysqlEnum('email_status', ['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.emailNotificationId],
      name: 'tbl_email_notifications_email_notification_id',
    }),
  ],
);
