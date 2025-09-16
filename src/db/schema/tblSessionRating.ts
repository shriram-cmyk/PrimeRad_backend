import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  int,
  text,
  boolean,
  timestamp,
  datetime,
  primaryKey,
  unique,
} from 'drizzle-orm/mysql-core';

export const tblSessionRating = mysqlTable(
  'tbl_session_rating',
  {
    sessionRatingId: int('session_rating_id').autoincrement().notNull(),
    sessionId: int('session_id').notNull(),
    regId: int('reg_id').notNull(),
    rating: int().notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({
      columns: [table.sessionRatingId],
      name: 'tbl_session_rating_session_rating_id',
    }),
    unique('unique_session_reg').on(table.sessionId, table.regId),
  ],
);
