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
} from 'drizzle-orm/mysql-core';

export const tblUserTickets = mysqlTable(
  'tbl_user_tickets',
  {
    userTicketId: int('user_ticket_id').autoincrement().notNull(),
    regId: int('reg_id').notNull(),
    ticketType: varchar('ticket_type', { length: 20 }).notNull(),
    ticketTitle: varchar('ticket_title', { length: 250 }).notNull(),
    ticketDescription: text('ticket_description'),
    ticketFile: varchar('ticket_file', { length: 100 }),
    ticketStatus: mysqlEnum('ticket_status', ['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.userTicketId],
      name: 'tbl_user_tickets_user_ticket_id',
    }),
  ],
);
