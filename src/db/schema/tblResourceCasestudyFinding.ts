import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  int,
  text,
  boolean,
  timestamp,
  datetime,
  primaryKey,
} from 'drizzle-orm/mysql-core';

export const tblResourceCasestudyFinding = mysqlTable(
  'tbl_resource_casestudy_finding',
  {
    resourceCasestudyFindingId: int('resource_casestudy_finding_id')
      .autoincrement()
      .notNull(),
    resourcehubId: int('resourcehub_id').notNull(),
    regId: int('reg_id').notNull(),
    casestudyFinding: text('casestudy_finding').notNull(),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({
      columns: [table.resourceCasestudyFindingId],
      name: 'tbl_resource_casestudy_finding_resource_casestudy_finding_id',
    }),
  ],
);
