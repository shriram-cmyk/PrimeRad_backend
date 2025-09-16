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

export const tblCountryCurrency = mysqlTable(
  'tbl_country_currency',
  {
    currencyId: int('currency_id').autoincrement().notNull(),
    batchId: int('batch_id'),
    countryName: varchar('country_name', { length: 100 }).notNull(),
    countryCode: varchar('country_code', { length: 10 }).notNull(),
    countryTier: varchar('country_tier', { length: 10 }).notNull(),
    currency: varchar({ length: 10 }).notNull(),
    fullAmount: int('full_amount').notNull(),
    fullAmountDiscounted: int('full_amount_discounted').notNull(),
    instaAmount: int('insta_amount').notNull(),
    instaAmountTranche: int('insta_amount_tranche').notNull(),
    instaAmountDiscounted: int('insta_amount_discounted').notNull(),
    instaAmountDiscountedTranche: int(
      'insta_amount_discounted_tranche',
    ).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({
      columns: [table.currencyId],
      name: 'tbl_country_currency_currency_id',
    }),
  ],
);
