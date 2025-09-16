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

export const tblCoupons = mysqlTable(
  'tbl_coupons',
  {
    couponId: int('coupon_id').autoincrement().notNull(),
    programId: int('program_id').notNull(),
    batchId: int('batch_id'),
    couponName: varchar('coupon_name', { length: 100 }).notNull(),
    couponCode: varchar('coupon_code', { length: 50 }).notNull(),
    designation: varchar({ length: 100 }),
    paymentOption: varchar('payment_option', { length: 50 }).notNull(),
    discountType: mysqlEnum('discount_type', ['1', '0']),
    inrDiscount: int('inr_discount').default(0).notNull(),
    usdDiscount: int('usd_discount').notNull(),
    countryTier: varchar('country_tier', { length: 10 }).default('0').notNull(),
    totalCoupons: int('total_coupons').notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    expiryDate: date('expiry_date', { mode: 'string' }).notNull(),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({ columns: [table.couponId], name: 'tbl_coupons_coupon_id' }),
  ],
);
