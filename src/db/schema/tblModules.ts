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
  datetime,
  primaryKey,
} from 'drizzle-orm/mysql-core';

export const tblModules = mysqlTable(
  'tbl_modules',
  {
    moduleId: int('module_id').autoincrement().notNull(),
    programId: int('program_id'),
    batchId: int('batch_id'),
    moduleName: varchar('module_name', { length: 100 }).notNull(),
    moduleDescription: varchar('module_description', { length: 500 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    moduleStartdate: date('module_startdate', { mode: 'string' }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    module2Startdate: date('module2_startdate', { mode: 'string' }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    module3Startdate: date('module3_startdate', { mode: 'string' }),
    moduleImage: varchar('module_image', { length: 100 }),
    programType: mysqlEnum('program_type', ['0', '1']).notNull(),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({ columns: [table.moduleId], name: 'tbl_modules_module_id' }),
  ],
);
