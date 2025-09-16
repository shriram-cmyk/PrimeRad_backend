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
} from 'drizzle-orm/mysql-core';

export const tblQueriesUpvote = mysqlTable(
  'tbl_queries_upvote',
  {
    tblQueriesUpvoteId: int('tbl_queries_upvote_id').autoincrement().notNull(),
    queriesId: int('queries_id').notNull(),
    regId: int('reg_id').notNull(),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.tblQueriesUpvoteId],
      name: 'tbl_queries_upvote_tbl_queries_upvote_id',
    }),
  ],
);
