import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  int,
  text,
  boolean,
  longtext,
  timestamp,
  primaryKey,
} from 'drizzle-orm/mysql-core';

export const tblQueryResponses = mysqlTable(
  'tbl_query_responses',
  {
    queryResponseId: int('query_response_id').autoincrement().notNull(),
    queriesId: int('queries_id').notNull(),
    regId: int('reg_id').notNull(),
    response: longtext().notNull(),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.queryResponseId],
      name: 'tbl_query_responses_query_response_id',
    }),
  ],
);
