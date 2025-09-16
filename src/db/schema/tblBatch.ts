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

export const tblBatch = mysqlTable(
  'tbl_batch',
  {
    batchProgramId: int('batch_program_id').autoincrement().notNull(),
    programId: int('program_id').notNull(),
    batchId: int('batch_id').notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    batchStartdate: date('batch_startdate', { mode: 'string' }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    batchEnddate: date('batch_enddate', { mode: 'string' }).notNull(),
    delegateDiscountType: mysqlEnum('delegate_discount_type', ['1', '2']),
    delegateDiscount: float('delegate_discount').notNull(),
    usdDelegateDiscountType: mysqlEnum('usd_delegate_discount_type', [
      '1',
      '2',
    ]),
    usdDelegateDiscount: float('usd_delegate_discount').notNull(),
    userDiscountType: mysqlEnum('user_discount_type', ['1', '2']),
    userDiscount: float('user_discount').notNull(),
    usdUserDiscountType: mysqlEnum('usd_user_discount_type', ['1', '2']),
    usdUserDiscount: float('usd_user_discount').notNull(),
    refereeDiscountType: mysqlEnum('referee_discount_type', ['1', '2']),
    refereeDiscount: float('referee_discount').notNull(),
    usdRefereeDiscountType: mysqlEnum('usd_referee_discount_type', ['1', '2']),
    usdRefereeDiscount: float('usd_referee_discount').notNull(),
    salesPage: mysqlEnum('sales_page', ['Yes', 'No']).notNull(),
    consumptionPage: mysqlEnum('consumption_page', ['Yes', 'No']).notNull(),
    programImage: varchar('program_image', { length: 100 }),
    programVideo: varchar('program_video', { length: 500 }),
    programDuration: varchar('program_duration', { length: 50 }),
    phases: int(),
    modules: int(),
    videos: int(),
    dicom: int(),
    assessments: int(),
    meetings: int(),
    pdfs: int(),
    certificates: int(),
    batchImage: varchar('batch_image', { length: 255 }),
    status: mysqlEnum(['1', '0']).notNull(),
    bonuslectureStatus: mysqlEnum('bonuslecture_status', [
      'Yes',
      'No',
    ]).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.batchProgramId],
      name: 'tbl_batch_batch_program_id',
    }),
  ],
);
