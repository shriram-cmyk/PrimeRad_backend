import {
  Injectable,
  Inject,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import {
  tblPayments,
  tblProgram,
  tblBatch,
  tblModules,
  tblPhases,
  tblSessions,
  tblPollOptions,
  tblPolls,
  tblPollstatus,
} from '../db/schema';
import { eq, sql, and, or, inArray } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OpenAccessService {
  constructor(@Inject('DB') private readonly db: MySql2Database) {}

  async getOpenAccessItems(
    regId?: number,
    typeFilter?: 'Dicom' | 'Video' | 'Poll',
  ) {
    try {
      let sessions: any[] = [];
      if (!typeFilter || typeFilter === 'Dicom' || typeFilter === 'Video') {
        sessions = await this.db
          .select({
            id: tblSessions.sessionId,
            name: tblSessions.sessionName,
            type: sql<string>`'session'`,
            sessionType: tblSessions.sessionType,
            description: tblSessions.sessionDescription,
            url: tblSessions.sessionUrl,
            image: tblSessions.sessionImage,
            startDate: tblSessions.startDate,
            startTime: tblSessions.startTime,
            endDate: tblSessions.endDate,
            endTime: tblSessions.endTime,
            videoStatus: tblSessions.videoStatus,
          })
          .from(tblSessions)
          .where(
            and(
              eq(tblSessions.programType, '1'),
              typeFilter === 'Dicom'
                ? eq(tblSessions.sessionType, 'Dicom')
                : typeFilter === 'Video'
                  ? eq(tblSessions.sessionType, 'Vimeo')
                  : undefined,
            ),
          );
      }

      let polls: any[] = [];
      if (!typeFilter || typeFilter === 'Poll') {
        polls = await this.db
          .select({
            id: tblPolls.pollId,
            name: tblPolls.question,
            type: sql<string>`'poll'`,
            startDatetime: tblPolls.startDatetime,
            endDatetime: tblPolls.endDatetime,
            status: tblPolls.status,
          })
          .from(tblPolls);

        const pollIds = polls.map((p) => p.id);
      }

      const mergedItems = [...sessions, ...polls];

      return {
        success: true,
        items: mergedItems,
      };
    } catch (error) {
      console.error('Error fetching open access items:', error);
      throw error;
    }
  }

  async getPolls(pollId?: number) {
    const polls = await this.db
      .select({
        id: tblPolls.pollId,
        moduleId: tblPolls.moduleId,
        question: tblPolls.question,
        startDatetime: tblPolls.startDatetime,
        endDatetime: tblPolls.endDatetime,
        status: tblPolls.status,
      })
      .from(tblPolls)
      .where(pollId ? eq(tblPolls.pollId, pollId) : undefined);

    const pollIds = polls.map((p) => p.id);

    const options =
      pollIds.length > 0
        ? await this.db
            .select({
              optionId: tblPollOptions.optionId,
              pollId: tblPollOptions.pollId,
              optionText: tblPollOptions.optionText,
              status: tblPollOptions.status,
              votes: tblPollOptions.votes,
            })
            .from(tblPollOptions)
            .where(inArray(tblPollOptions.pollId, pollIds))
        : [];

    const pollStatuses =
      pollIds.length > 0 && pollId
        ? await this.db
            .select({
              pollId: tblPollstatus.pollId,
              pollStatus: tblPollstatus.pollStatus,
            })
            .from(tblPollstatus)
            .where(and(inArray(tblPollstatus.pollId, pollIds)))
        : [];

    const pollsWithOptions = polls.map((poll) => {
      const pollOptions = options.filter((o) => o.pollId === poll.id);
      const userStatus = pollStatuses.find((s) => s.pollId === poll.id);
      return {
        ...poll,
        options: pollOptions,
        userStatus: userStatus?.pollStatus ?? '0',
      };
    });

    return {
      success: true,
      polls: pollsWithOptions,
    };
  }

  async submitPoll(regId: number, pollId: number, optionId: number) {
    const existing = await this.db
      .select()
      .from(tblPollstatus)
      .where(
        and(eq(tblPollstatus.regId, regId), eq(tblPollstatus.pollId, pollId)),
      );

    if (existing.length > 0) {
      throw new ConflictException('User has already submitted this poll');
    }

    // Insert poll status
    await this.db.insert(tblPollstatus).values({
      pollId,
      regId,
      pollStatus: '1', // assuming '1' means submitted
    });

    // Increment vote count for the selected option
    await this.db
      .update(tblPollOptions)
      .set({
        votes: sql`${tblPollOptions.votes} + 1`,
      })
      .where(eq(tblPollOptions.optionId, optionId));

    return { success: true, message: 'Poll submitted successfully' };
  }
}
