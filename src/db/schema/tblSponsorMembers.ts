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

export const tblSponsorMembers = mysqlTable(
  'tbl_sponsor_members',
  {
    sponsorMemberId: int('sponsor_member_id').autoincrement().notNull(),
    sponsorMemberName: varchar('sponsor_member_name', {
      length: 100,
    }).notNull(),
    sponsorMemberLocation: varchar('sponsor_member_location', { length: 100 }),
    sponsorMemberImage: varchar('sponsor_member_image', { length: 100 }),
    sponsorMemberDescription: varchar('sponsor_member_description', {
      length: 500,
    }),
    sponsorMemberEmail: varchar('sponsor_member_email', { length: 100 }),
    sponsorMemberPassword: varchar('sponsor_member_password', { length: 100 }),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({
      columns: [table.sponsorMemberId],
      name: 'tbl_sponsor_members_sponsor_member_id',
    }),
  ],
);
