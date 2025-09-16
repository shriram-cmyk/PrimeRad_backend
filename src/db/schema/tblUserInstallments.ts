import { sql } from 'drizzle-orm';
import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  int,
  text,
  boolean,
  float,
  datetime,
  primaryKey,
} from 'drizzle-orm/mysql-core';

export const tblUserInstallments = mysqlTable(
  'tbl_user_installments',
  {
    id: int().autoincrement().notNull(),
    regId: int('reg_id').notNull(),
    programId: int('program_id').notNull(),
    batchId: int('batch_id').notNull(),
    paidFor: int('paid_for'),
    programName: varchar('program_name', { length: 50 }),
    currency: varchar({ length: 50 }).notNull(),
    countryTier: int('country_tier'),
    totalInstallmentAmount: float('total_installment_amount').notNull(),
    installmentCount: int('installment_count').notNull(),
    payAmount: float('pay_amount').notNull(),
    salesCommitAmount: float('sales_commit_amount').notNull(),
    salesCommitAmountWithtax: float('sales_commit_amount_withtax').notNull(),
    advanceAmount: float('advance_amount').notNull(),
    redeemAmount: float('redeem_amount').notNull(),
    discountAmount: float('discount_amount').notNull(),
    taxes: float().notNull(),
    finalAmount: float('final_amount').notNull(),
    payId: varchar('pay_id', { length: 50 }),
    payStatus: mysqlEnum('pay_status', ['pending', 'captured']),
    payDate: datetime('pay_date', { mode: 'string' }),
    createdDate: datetime('created_date', { mode: 'string' })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'tbl_user_installments_id' }),
  ],
);
