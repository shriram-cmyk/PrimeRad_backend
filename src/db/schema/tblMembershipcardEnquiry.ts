import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  int,
  text,
  boolean,
  datetime,
  primaryKey,
} from 'drizzle-orm/mysql-core';

export const tblMembershipcardEnquiry = mysqlTable(
  'tbl_membershipcard_enquiry',
  {
    id: int().autoincrement().notNull(),
    username: varchar({ length: 30 }).notNull(),
    instituteName: varchar('institute_name', { length: 500 }).notNull(),
    city: varchar({ length: 30 }).notNull(),
    currently: varchar({ length: 100 }).notNull(),
    email: varchar({ length: 50 }).notNull(),
    mobileNumber: varchar('mobile_number', { length: 30 }).notNull(),
    updatedDate: datetime('updated_date', { mode: 'string' }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'tbl_membershipcard_enquiry_id' }),
  ],
);
