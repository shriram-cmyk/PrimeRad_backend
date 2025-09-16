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
  float,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const tblAdvancePayment = mysqlTable(
  'tbl_advance_payment',
  {
    id: int().autoincrement().notNull(),
    userId: int('user_id').notNull(),
    programId: int('program_id').notNull(),
    batchId: int('batch_id').notNull(),
    paymentOption: varchar('payment_option', { length: 50 }).notNull(),
    designation: varchar({ length: 50 }).notNull(),
    currency: varchar({ length: 50 }).notNull(),
    advanceAmount: float('advance_amount').notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    paymentDate: date('payment_date', { mode: 'string' }).notNull(),
    paymentId: varchar('payment_id', { length: 255 }).notNull(),
    invoiceNumber: int('invoice_number').default(0).notNull(),
    status: mysqlEnum(['1', '0']).notNull(),
    purchaseStatus: mysqlEnum('purchase_status', ['0', '1']).notNull(),
    reason: longtext(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    modifiedDate: date('modified_date', { mode: 'string' }),
    createdDate: datetime('created_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'tbl_advance_payment_id' }),
  ],
);
