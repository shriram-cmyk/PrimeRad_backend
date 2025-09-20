import {
  mysqlTable,
  serial,
  int,
  date,
  mysqlEnum,
  primaryKey,
  index,
} from 'drizzle-orm/mysql-core';

export const tblEnrollments = mysqlTable(
  'tbl_enrollments',
  {
    enrollmentId: serial('enrollment_id').primaryKey().notNull(),

    regId: int('reg_id').notNull(),
    programId: int('program_id').notNull(),
    batchId: int('batch_id').notNull(),

    enrolledDate: date('enrolled_date', { mode: 'string' }).notNull(),

    payStatus: mysqlEnum('pay_status', [
      'pending',
      'captured',
      'failed',
    ]).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.enrollmentId] }),

    index('idx_user_status').on(table.regId, table.payStatus),
    index('idx_program').on(table.programId),
    index('idx_batch').on(table.batchId),
    index('idx_reg_batch').on(table.regId, table.batchId),
  ],
);
