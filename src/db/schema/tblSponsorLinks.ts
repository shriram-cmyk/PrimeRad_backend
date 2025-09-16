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

export const tblSponsorLinks = mysqlTable(
  'tbl_sponsor_links',
  {
    sponsorLinkId: int('sponsor_link_id').autoincrement().notNull(),
    sessionId: int('session_id').notNull(),
    sponsorName: varchar('sponsor_name', { length: 500 }).notNull(),
    sponsorDescription: varchar('sponsor_description', { length: 1000 }),
    sponsorLink: varchar('sponsor_link', { length: 100 }),
    sponsorImage: varchar('sponsor_image', { length: 100 }),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({
      columns: [table.sponsorLinkId],
      name: 'tbl_sponsor_links_sponsor_link_id',
    }),
  ],
);
