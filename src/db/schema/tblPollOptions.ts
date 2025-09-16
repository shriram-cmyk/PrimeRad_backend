import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  int,
  text,
  boolean,
  primaryKey,
} from 'drizzle-orm/mysql-core';
import { tblPolls } from './tblPolls';

export const tblPollOptions = mysqlTable(
  'tbl_poll_options',
  {
    optionId: int('option_id').autoincrement().notNull(),
    pollId: int('poll_id')
      .notNull()
      .references(() => tblPolls.pollId, { onDelete: 'cascade' }),
    optionText: varchar('option_text', { length: 255 }).notNull(),
    status: mysqlEnum(['1', '2']).notNull(),
    votes: int().default(0),
  },
  (table) => [
    primaryKey({
      columns: [table.optionId],
      name: 'tbl_poll_options_option_id',
    }),
  ],
);
