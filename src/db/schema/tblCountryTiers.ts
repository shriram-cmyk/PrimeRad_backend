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

export const tblCountryTiers = mysqlTable(
  'tbl_country_tiers',
  {
    countryId: int('country_id').autoincrement().notNull(),
    countryName: varchar('country_name', { length: 100 }).notNull(),
    countryCode: varchar('country_code', { length: 10 }).notNull(),
    countryTier: varchar('country_tier', { length: 10 }).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.countryId],
      name: 'tbl_country_tiers_country_id',
    }),
  ],
);
