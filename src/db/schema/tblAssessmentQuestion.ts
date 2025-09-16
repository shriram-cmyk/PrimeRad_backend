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

export const tblAssessmentQuestion = mysqlTable(
  'tbl_assessment_question',
  {
    assessmentQuestionId: int('assessment_question_id')
      .autoincrement()
      .notNull(),
    sessionId: int('session_id').notNull(),
    assessmentQuestion: varchar('assessment_question', {
      length: 1000,
    }).notNull(),
    assessmentQuestionDescription: varchar('assessment_question_description', {
      length: 1000,
    }).notNull(),
    answerOptionA: varchar('answer_option_a', { length: 500 }).notNull(),
    answerOptionB: varchar('answer_option_b', { length: 500 }).notNull(),
    answerOptionC: varchar('answer_option_c', { length: 500 }).notNull(),
    answerOptionD: varchar('answer_option_d', { length: 500 }).notNull(),
    questionImage: varchar('question_image', { length: 100 }).default(
      'default_image',
    ),
    correctAnswer: varchar('correct_answer', { length: 50 }).notNull(),
    status: mysqlEnum(['1', '0']).notNull(),
    createdDate: timestamp('created_date', { mode: 'string' })
      .defaultNow()
      .notNull(),
    modifiedDate: datetime('modified_date', { mode: 'string' }),
  },
  (table) => [
    primaryKey({
      columns: [table.assessmentQuestionId],
      name: 'tbl_assessment_question_assessment_question_id',
    }),
  ],
);
