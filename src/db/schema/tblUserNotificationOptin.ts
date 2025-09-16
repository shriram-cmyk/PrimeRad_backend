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
  unique,
} from 'drizzle-orm/mysql-core';

export const tblUserNotificationOptin = mysqlTable(
  'tbl_user_notification_optin',
  {
    optinId: int('optin_id').autoincrement().notNull(),
    regId: int('reg_id').notNull(),
    newResource: mysqlEnum('new_resource', ['1', '0']).notNull(),
    queryResponse: mysqlEnum('query_response', ['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.optinId],
      name: 'tbl_user_notification_optin_optin_id',
    }),
    unique('reg_id').on(table.regId),
  ],
);
