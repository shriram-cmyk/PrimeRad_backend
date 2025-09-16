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

export const tblReferral = mysqlTable(
  'tbl_referral',
  {
    referralId: int('referral_id').autoincrement().notNull(),
    programId: int('program_id'),
    batchId: int('batch_id'),
    currency: varchar({ length: 50 }).notNull(),
    referrerCode: varchar('referrer_code', { length: 10 }).notNull(),
    referrerBonus: varchar('referrer_bonus', { length: 10 }).notNull(),
    refereeCode: varchar('referee_code', { length: 10 }).notNull(),
    refereeDiscount: varchar('referee_discount', { length: 10 }).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.referralId],
      name: 'tbl_referral_referral_id',
    }),
  ],
);
