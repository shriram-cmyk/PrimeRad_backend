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

export const tblExtendaccessPayment = mysqlTable(
  'tbl_extendaccess_payment',
  {
    id: int().autoincrement().notNull(),
    regId: int('reg_id').notNull(),
    programId: int('program_id').notNull(),
    batchId: int('batch_id').notNull(),
    trackAccess: varchar('track_access', { length: 50 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    accessStartdate: date('access_startdate', { mode: 'string' }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    accessEnddate: date('access_enddate', { mode: 'string' }).notNull(),
    currency: varchar({ length: 50 }).notNull(),
    payAmount: float('pay_amount').notNull(),
    taxes: float().notNull(),
    finalAmount: float('final_amount').notNull(),
    pgEmail: varchar('pg_email', { length: 255 }),
    pgMobile: varchar('pg_mobile', { length: 50 }),
    pgCurrency: varchar('pg_currency', { length: 50 }),
    pgAmount: float('pg_amount').notNull(),
    paymentEntry: varchar('payment_entry', { length: 100 }).notNull(),
    paySession: varchar('pay_session', { length: 255 }),
    paymentId: varchar('payment_id', { length: 255 }),
    payStatus: varchar('pay_status', { length: 155 }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    paymentDate: date('payment_date', { mode: 'string' }).notNull(),
    orderId: varchar('order_id', { length: 255 }).notNull(),
    orderStatus: varchar('order_status', { length: 155 }),
    invoiceNumber: varchar('invoice_number', { length: 50 }),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
    createdDate: datetime('created_date', { mode: 'string' }),
    accessStatus: mysqlEnum('access_status', ['1', '0']).notNull(),
    accessStatusModified: datetime('access_status_modified', {
      mode: 'string',
    }),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'tbl_extendaccess_payment_id' }),
  ],
);
