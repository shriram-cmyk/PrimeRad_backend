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
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const tblAssessmentUseranswer = mysqlTable(
  'tbl_assessment_useranswer',
  {
    assessmentAnswerId: int('assessment_answer_id').autoincrement().notNull(),
    sessionId: int('session_id').notNull(),
    assessmentQuestionId: int('assessment_question_id').notNull(),
    regId: int('reg_id').notNull(),
    assessmentAnswer: varchar('assessment_answer', { length: 100 }).notNull(),
    score: int().notNull(),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.assessmentAnswerId],
      name: 'tbl_assessment_useranswer_assessment_answer_id',
    }),
  ],
);
