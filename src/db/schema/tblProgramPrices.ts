import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  int,
  text,
  boolean,
  float,
  primaryKey,
} from 'drizzle-orm/mysql-core';

export const tblProgramPrices = mysqlTable(
  'tbl_program_prices',
  {
    id: int().autoincrement().notNull(),
    programId: int('program_id').notNull(),
    batchId: int('batch_id').notNull(),
    designation: varchar({ length: 50 }).notNull(),
    countryTier: int('country_tier').notNull(),
    currency: varchar({ length: 50 }),
    displayPrice: float('display_price').notNull(),
    fullAmount: float('full_amount').notNull(),
    totalInstallmentAmount: float('total_installment_amount').notNull(),
    installmentPay1: float('installment_pay1').notNull(),
    installmentPay2: float('installment_pay2').notNull(),
    installmentPay3: float('installment_pay3').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'tbl_program_prices_id' }),
  ],
);
