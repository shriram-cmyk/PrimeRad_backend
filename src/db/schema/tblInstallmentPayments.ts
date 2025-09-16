import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  int,
  text,
  boolean,
  float,
  date,
  timestamp,
  datetime,
  primaryKey,
} from 'drizzle-orm/mysql-core';

export const tblInstallmentPayments = mysqlTable(
  'tbl_installment_payments',
  {
    paymentId: int('payment_id').autoincrement().notNull(),
    regId: int('reg_id').notNull(),
    programId: int('program_id').notNull(),
    batchId: int('batch_id'),
    paidFor: int('paid_for').notNull(),
    programName: varchar('program_name', { length: 100 }).notNull(),
    paymentOption: varchar('payment_option', { length: 50 })
      .default('Installment')
      .notNull(),
    installmentCount: varchar('installment_count', { length: 50 }).notNull(),
    programAmount: varchar('program_amount', { length: 50 }).notNull(),
    salesCommitAmount: float('sales_commit_amount').notNull(),
    salesCommitAmountWithtax: float('sales_commit_amount_withtax').notNull(),
    couponCode: varchar('coupon_code', { length: 50 }),
    discountAmount: varchar('discount_amount', { length: 50 }),
    discountReferralAmount: varchar('discount_referral_amount', { length: 50 }),
    discountReferralPerson: varchar('discount_referral_person', { length: 50 }),
    referrerCode: varchar('referrer_code', { length: 10 }),
    redeemAmount: float('redeem_amount').notNull(),
    advanceAmount: float('advance_amount').notNull(),
    subtotalAmount: varchar('subtotal_amount', { length: 50 }).notNull(),
    taxAmount: varchar('tax_amount', { length: 50 }).notNull(),
    finalAmount: varchar('final_amount', { length: 50 }).notNull(),
    currency: varchar({ length: 10 }).notNull(),
    orderId: varchar('order_id', { length: 50 }).notNull(),
    orderStatus: varchar('order_status', { length: 50 }),
    paySession: varchar('pay_session', { length: 50 }).notNull(),
    pgEmail: varchar('pg_email', { length: 100 }),
    pgMobile: varchar('pg_mobile', { length: 50 }),
    pgCurrency: varchar('pg_currency', { length: 50 }),
    pgAmount: varchar('pg_amount', { length: 50 }),
    paymentEntry: varchar('payment_entry', { length: 50 }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    paymentDate: date('payment_date', { mode: 'string' }),
    payId: varchar('pay_id', { length: 50 }),
    payStatus: varchar('pay_status', { length: 50 }),
    invoiceNumber: int('invoice_number'),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({
      columns: [table.paymentId],
      name: 'tbl_installment_payments_payment_id',
    }),
  ],
);
