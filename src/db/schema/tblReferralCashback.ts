import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  int,
  text,
  boolean,
  date,
  timestamp,
  primaryKey,
} from 'drizzle-orm/mysql-core';

export const tblReferralCashback = mysqlTable(
  'tbl_referral_cashback',
  {
    referralCashbackId: int('referral_cashback_id').autoincrement().notNull(),
    currency: varchar({ length: 50 }).notNull(),
    referrerCode: varchar('referrer_code', { length: 10 }).notNull(),
    cashbackCredited: varchar('cashback_credited', { length: 10 }).notNull(),
    referenceNumber: varchar('reference_number', { length: 100 }).notNull(),
    cashbackType: mysqlEnum('cashback_type', ['0', '1']).notNull(),
    paymentId: varchar('payment_id', { length: 50 }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    paidDate: date('paid_date', { mode: 'string' }).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.referralCashbackId],
      name: 'tbl_referral_cashback_referral_cashback_id',
    }),
  ],
);
