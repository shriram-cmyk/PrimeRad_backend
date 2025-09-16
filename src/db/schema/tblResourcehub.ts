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

export const tblResourcehub = mysqlTable(
  'tbl_resourcehub',
  {
    resourcehubId: int('resourcehub_id').autoincrement().notNull(),
    moduleId: int('module_id'),
    resourcehubTitle: varchar('resourcehub_title', { length: 100 }).notNull(),
    resourcehubDescription: text('resourcehub_description'),
    resourcehubType: varchar('resourcehub_type', { length: 10 }),
    resourcehubImage: varchar('resourcehub_image', { length: 100 }),
    status: mysqlEnum(['1', '0']).notNull(),
    createdBy: int('created_by'),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({
      columns: [table.resourcehubId],
      name: 'tbl_resourcehub_resourcehub_id',
    }),
  ],
);
