import { Injectable, Inject } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import {
  tblPayments,
  tblProgram,
  tblBatch,
  tblModules,
  tblPhases,
  tblSessions,
  tblAssessmentQuestion,
  tblAssessmentUseranswer,
  tblQueries,
  tblQueryResponses,
  tblFaculty,
  tblFacultyMap,
  tblSessionResources,
  tblSessionstatus,
} from '../db/schema';
import { CreateQueryDto } from './dto/create-query-dto';
import { CreateQueryResponseDto } from './dto/create-query-response-dto';
import { and, eq, sql, gt, inArray } from 'drizzle-orm';

@Injectable()
export class FellowshipService {
  constructor(@Inject('DB') private readonly db: MySql2Database) {}

  async getCapturedProgramsByUser(regId: number, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      // Count distinct batches
      const [countResult] = await this.db
        .select({
          count: sql<number>`COUNT(DISTINCT ${tblPayments.batchId})`,
        })
        .from(tblPayments)
        .where(
          and(
            eq(tblPayments.regId, regId),
            eq(tblPayments.payStatus, 'captured'),
          ),
        );

      const total = countResult?.count ?? 0;

      // Fetch programs grouped by batchId with ANY_VALUE
      const programs = await this.db
        .select({
          programId: sql<number>`ANY_VALUE(${tblProgram.programId})`,
          programName: sql<string>`ANY_VALUE(${tblProgram.programName})`,
          programShortname: sql<string>`ANY_VALUE(${tblProgram.programShortname})`,
          programUrl: sql<string>`ANY_VALUE(${tblProgram.programUrl})`,
          programTitle: sql<string>`ANY_VALUE(${tblProgram.programTitle})`,
          programDescription: sql<string>`ANY_VALUE(${tblProgram.programDescription})`,
          programImage: sql<string>`ANY_VALUE(${tblProgram.programImage})`,
          programDuration: sql<number>`ANY_VALUE(${tblProgram.programDuration})`,

          batchId: tblBatch.batchId,
          batchName: sql<string>`CONCAT('Batch ', ${tblBatch.batchId})`,
          batchStart: sql<Date>`ANY_VALUE(${tblBatch.batchStartdate})`,
          batchEnd: sql<Date>`ANY_VALUE(${tblBatch.batchEnddate})`,

          enrolledDate: sql<Date>`MIN(${tblPayments.paymentDate})`,
          moduleCount: sql<number>`ANY_VALUE(${tblBatch.modules})`,
          payStatus: sql<string>`MAX(${tblPayments.payStatus})`,
        })
        .from(tblPayments)
        .leftJoin(tblProgram, eq(tblPayments.programId, tblProgram.programId))
        .leftJoin(tblBatch, eq(tblPayments.batchId, tblBatch.batchId))
        .where(
          and(
            eq(tblPayments.regId, regId),
            eq(tblPayments.payStatus, 'captured'),
          ),
        )
        .groupBy(tblBatch.batchId)
        .limit(limit)
        .offset(offset);

      return {
        success: true,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        data: programs,
      };
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  }

  async getProgramDetailsByUser(
    regId: number,
    programId: number,
    batchId: number,
  ) {
    try {
      const [payment] = await this.db
        .select({
          paymentId: tblPayments.paymentId,
        })
        .from(tblPayments)
        .where(
          and(
            eq(tblPayments.regId, regId),
            eq(tblPayments.programId, programId),
            eq(tblPayments.batchId, batchId),
            eq(tblPayments.payStatus, 'captured'),
          ),
        );

      if (!payment) {
        return {
          success: false,
          message: 'User has not purchased this program or batch.',
        };
      }

      const [batchDetails] = await this.db
        .select({
          modulesCount: tblBatch.modules,
          videosCount: tblBatch.videos,
          dicomCount: tblBatch.dicom,
          assessmentCount: tblBatch.assessments,
          certificateCount: tblBatch.certificates,
          meetingCount: tblBatch.meetings,
        })
        .from(tblBatch)
        .where(
          and(eq(tblBatch.programId, programId), eq(tblBatch.batchId, batchId)),
        );

      const phases = await this.db
        .select({
          phaseId: tblPhases.phaseId,
          phaseName: tblPhases.phaseName,
          phaseDescription: tblPhases.phaseDescription,
          phaseImage: tblPhases.phaseImage,
          phaseStart: tblPhases.phaseStartDate,
          phaseEnd: tblPhases.phaseEndDate,
        })
        .from(tblPhases)
        .where(
          and(
            eq(tblPhases.programId, programId),
            eq(tblPhases.batchId, batchId),
          ),
        );

      const phasesWithModules: any[] = [];
      for (const phase of phases) {
        const modules = await this.db
          .select({
            moduleId: tblModules.moduleId,
            moduleName: tblModules.moduleName,
            moduleDescription: tblModules.moduleDescription,
            moduleImage: tblModules.moduleImage,
            moduleStart: tblModules.moduleStartdate,
            module2Start: tblModules.module2Startdate,
            module3Start: tblModules.module3Startdate,
            programType: tblModules.programType,
          })
          .from(tblModules)
          .where(
            and(
              eq(tblModules.programId, programId),
              eq(tblModules.batchId, batchId),
            ),
          );

        phasesWithModules.push({
          ...phase,
          moduleCount: modules.length,
          modules,
        });
      }

      return {
        success: true,
        counts: batchDetails ?? {},
        trackCount: phasesWithModules.length,
        phases: phasesWithModules,
      };
    } catch (error) {
      console.error('Error fetching program details:', error);
      throw error;
    }
  }

  async getSessionsByModule(
    programId: number,
    batchId: number,
    phaseId: number,
    moduleId: number,
  ) {
    try {
      const sessions = await this.db
        .select({
          sessionId: tblSessions.sessionId,
          sessionName: tblSessions.sessionName,
          sessionType: tblSessions.sessionType,
        })
        .from(tblSessions)
        .where(
          and(
            eq(tblSessions.programId, programId),
            eq(tblSessions.batchId, batchId),
            eq(tblSessions.phaseId, phaseId),
            eq(tblSessions.moduleId, moduleId),
          ),
        );

      const sessionIds = sessions.map((s) => s.sessionId);

      const statuses = await this.db
        .select({
          sessionId: tblSessionstatus.sessionId,
          sessionStatus: tblSessionstatus.sessionStatus,
        })
        .from(tblSessionstatus)
        .where(inArray(tblSessionstatus.sessionId, sessionIds));

      const grouped: Record<
        string,
        {
          sessions: { name: string; progress: number }[];
          progressValues: number[];
        }
      > = {};

      for (const s of sessions) {
        const status = statuses.find(
          (st) => st.sessionId === s.sessionId,
        )?.sessionStatus;

        let progressValue = 0;
        if (status === '2') progressValue = 100;
        else if (status === '1') progressValue = 50;

        if (!grouped[s.sessionType]) {
          grouped[s.sessionType] = { sessions: [], progressValues: [] };
        }

        grouped[s.sessionType].sessions.push({
          name: s.sessionName,
          progress: progressValue,
        });

        grouped[s.sessionType].progressValues.push(progressValue);
      }

      const resultSessions: Record<
        string,
        { name: string; progress: number }[]
      > = {};
      const progress: Record<string, number> = {};

      for (const key of Object.keys(grouped)) {
        const g = grouped[key];
        resultSessions[key] = g.sessions;

        const totalProgress = g.progressValues.reduce((a, b) => a + b, 0);
        const avgProgress =
          g.progressValues.length > 0
            ? Math.round(totalProgress / g.progressValues.length)
            : 0;
        progress[key] = avgProgress;
      }

      return {
        success: true,
        sessions: resultSessions,
        progress,
      };
    } catch (error) {
      console.error('Error fetching sessions by module:', error);
      throw error;
    }
  }

  async getAllSessions(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const [countResult] = await this.db
        .select({ count: sql<number>`COUNT(*)` })
        .from(tblSessions);

      const total = countResult?.count ?? 0;

      const sessions = await this.db
        .select({
          sessionName: tblSessions.sessionName,
          sessionType: tblSessions.sessionType,
          startDate: tblSessions.startDate,
          endDate: tblSessions.endDate,
        })
        .from(tblSessions)
        .limit(limit)
        .offset(offset);

      return {
        success: true,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        data: sessions,
      };
    } catch (error) {
      console.error('Error fetching all sessions:', error);
      throw error;
    }
  }

  async getSessionDetails(sessionId: number) {
    try {
      const [session] = await this.db
        .select({
          sessionId: tblSessions.sessionId,
          sessionDuration: tblSessions.duration,
          sessionImage: tblSessions.sessionImage,
          sessionName: tblSessions.sessionName,
          sessionType: tblSessions.sessionType,
          sessionUrl: tblSessions.sessionUrl,
          isZoom: tblSessions.isZoom,
          zoomMeetingId: tblSessions.zoomMeetingId,
          zoomStartdate: tblSessions.zoomStartdate,
          zoomEnddate: tblSessions.zoomEnddate,
          zoomPassword: tblSessions.zoomPassword,
          zoomLiveLink: tblSessions.zoomLiveLink,
          dicomVideoUrl: tblSessions.dicomVideoUrl,
          dicomCaseId: tblSessions.dicomCaseId,
        })
        .from(tblSessions)
        .where(eq(tblSessions.sessionId, sessionId));

      if (!session) {
        return {
          success: false,
          message: 'Session not found',
        };
      }

      let details: Record<string, any> = {
        sessionDuration: session.sessionDuration,
        sessionName: session.sessionName,
        sessionType: session.sessionType,
        sessionImage: session.sessionImage,
      };

      if (session.sessionType === 'Live' || session.isZoom === '1') {
        details = {
          ...details,
          zoomMeetingId: session.zoomMeetingId,
          zoomStartdate: session.zoomStartdate,
          zoomEnddate: session.zoomEnddate,
          zoomPassword: session.zoomPassword,
          zoomLiveLink: session.zoomLiveLink,
        };
      } else if (session.sessionType === 'Dicom') {
        details = {
          ...details,
          dicomVideoUrl: session.dicomVideoUrl,
          dicomCaseId: session.dicomCaseId,
        };
      } else {
        details = {
          ...details,
          sessionUrl: session.sessionUrl,
        };
      }

      const faculty = await this.db
        .select({
          facultyId: tblFaculty.facultyId,
          facultyName: tblFaculty.facultyName,
          facultyType: tblFacultyMap.facultyType,
          facultyImage: tblFaculty.facultyImage,
          facultyLocation: tblFaculty.facultyLocation,
          facultyCountry: tblFaculty.facultyCountry,
        })
        .from(tblFacultyMap)
        .innerJoin(
          tblFaculty,
          eq(tblFacultyMap.facultyId, tblFaculty.facultyId),
        )
        .where(eq(tblFacultyMap.sessionId, sessionId));

      const resources = await this.db
        .select({
          fileType: tblSessionResources.fileType,
          displayName: tblSessionResources.displayname,
          linkName: tblSessionResources.linkName,
          fileName: tblSessionResources.fileName,
        })
        .from(tblSessionResources)
        .where(eq(tblSessionResources.sessionId, sessionId));

      const nextSessions = await this.db
        .select({
          sessionName: tblSessions.sessionName,
          moduleName: tblModules.moduleName,
          sessionImage: tblSessions.sessionImage,
        })
        .from(tblSessions)
        .innerJoin(tblModules, eq(tblSessions.moduleId, tblModules.moduleId))
        .where(gt(tblSessions.sessionId, sessionId))
        .orderBy(tblSessions.sessionId)
        .limit(5);

      return {
        success: true,
        data: {
          currentSession: details,
          faculty,
          resources,
          nextSessions,
        },
      };
    } catch (error) {
      console.error('Error fetching session details:', error);
      throw error;
    }
  }

  async getAssessmentQuestions(sessionId: number) {
    try {
      const questions = await this.db
        .select({
          assessmentQuestionId: tblAssessmentQuestion.assessmentQuestionId,
          assessmentQuestion: tblAssessmentQuestion.assessmentQuestion,
          assessmentQuestionDescription:
            tblAssessmentQuestion.assessmentQuestionDescription,
          answerOptionA: tblAssessmentQuestion.answerOptionA,
          answerOptionB: tblAssessmentQuestion.answerOptionB,
          answerOptionC: tblAssessmentQuestion.answerOptionC,
          answerOptionD: tblAssessmentQuestion.answerOptionD,
          questionImage: tblAssessmentQuestion.questionImage,
        })
        .from(tblAssessmentQuestion)
        .where(eq(tblAssessmentQuestion.sessionId, sessionId));

      return {
        success: true,
        data: questions,
      };
    } catch (error) {
      console.error('Error fetching assessment questions:', error);
      throw error;
    }
  }

  async getAssessmentAnswers(sessionId: number, regId: number) {
    try {
      const answers = await this.db
        .select({
          questionId: tblAssessmentUseranswer.assessmentQuestionId,
          userAnswer: tblAssessmentUseranswer.assessmentAnswer,
          correctAnswer: tblAssessmentQuestion.correctAnswer,
          question: tblAssessmentQuestion.assessmentQuestion,
          optionA: tblAssessmentQuestion.answerOptionA,
          optionB: tblAssessmentQuestion.answerOptionB,
          optionC: tblAssessmentQuestion.answerOptionC,
          optionD: tblAssessmentQuestion.answerOptionD,
        })
        .from(tblAssessmentUseranswer)
        .innerJoin(
          tblAssessmentQuestion,
          eq(
            tblAssessmentUseranswer.assessmentQuestionId,
            tblAssessmentQuestion.assessmentQuestionId,
          ),
        )
        .where(
          and(
            eq(tblAssessmentUseranswer.sessionId, sessionId),
            eq(tblAssessmentUseranswer.regId, regId),
          ),
        );

      const formatted = answers.map((a) => {
        const isCorrect = a.userAnswer === a.correctAnswer;
        return {
          questionId: a.questionId,
          question: a.question,
          options: {
            A: a.optionA,
            B: a.optionB,
            C: a.optionC,
            D: a.optionD,
          },
          userAnswer: a.userAnswer,
          correctAnswer: a.correctAnswer,
          isCorrect,
        };
      });

      const totalQuestions = formatted.length;
      const correctAnswers = formatted.filter((q) => q.isCorrect).length;

      return {
        success: true,
        stats: {
          totalQuestions,
          correctAnswers,
        },
        data: formatted,
      };
    } catch (error) {
      console.error('Error fetching assessment answers:', error);
      throw error;
    }
  }

  async submitAssessmentAnswers(
    sessionId: number,
    regId: number,
    answers: { questionId: number; answer: string }[],
  ) {
    try {
      const insertData = answers.map((ans) => ({
        sessionId,
        regId,
        assessmentQuestionId: ans.questionId,
        assessmentAnswer: ans.answer,
        score: 0,
        status: '1' as const,
      }));

      await this.db.insert(tblAssessmentUseranswer).values(insertData);

      return {
        success: true,
        message: 'Answers submitted successfully',
      };
    } catch (error) {
      console.error('Error submitting answers:', error);
      throw error;
    }
  }

  async getSessionQueriesWithResponses(sessionId: number) {
    try {
      const queries = await this.db
        .select({
          queryId: tblQueries.queriesId,
          message: tblQueries.message,
          anonymous: tblQueries.anonymous,
          anonymousName: tblQueries.anonymousName,
          likesCount: tblQueries.likesCount,
          dislikesCount: tblQueries.dislikesCount,
          createdDate: tblQueries.createdDate,
        })
        .from(tblQueries)
        .where(eq(tblQueries.sessionId, sessionId));

      const queryIds = queries.map((q) => q.queryId);
      const responses = await this.db
        .select({
          responseId: tblQueryResponses.queryResponseId,
          queriesId: tblQueryResponses.queriesId,
          response: tblQueryResponses.response,
          regId: tblQueryResponses.regId,
          createdDate: tblQueryResponses.createdDate,
        })
        .from(tblQueryResponses)
        .where(inArray(tblQueryResponses.queriesId, queryIds));

      const result = queries.map((q) => ({
        ...q,
        responses: responses.filter((r) => r.queriesId === q.queryId),
      }));

      return { success: true, data: result };
    } catch (error) {
      console.error('Error fetching session queries:', error);
      throw error;
    }
  }

  async createQuery(dto: CreateQueryDto, regId: any) {
    const insertedId = await this.db
      .insert(tblQueries)
      .values({
        programId: dto.programId,
        batchId: dto.batchId,
        regId: regId,
        moduleId: dto.moduleId,
        sessionId: dto.sessionId,
        anonymous: dto.anonymous,
        anonymousName: dto.anonymousName,
        message: dto.message,
        messagedetail: dto.messagedetail ?? null,
        status: '1',
        showStatus: '1',
      })
      .$returningId();

    return {
      success: true,
      data: {
        queriesId: insertedId,
        ...dto,
        createdDate: new Date().toISOString(),
      },
    };
  }

  async createQueryResponse(dto: CreateQueryResponseDto, regId: any) {
    const insertedId = await this.db
      .insert(tblQueryResponses)
      .values({
        queriesId: dto.queriesId,
        regId: regId,
        response: dto.response,
        status: '1',
      })
      .$returningId();

    return {
      success: true,
      data: {
        queryResponseId: insertedId,
        ...dto,
        createdDate: new Date().toISOString(),
      },
    };
  }

  async updateSessionStatus(
    regId: number,
    sessionId: number,
    status: '1' | '2',
  ) {
    try {
      const [existing] = await this.db
        .select()
        .from(tblSessionstatus)
        .where(
          and(
            eq(tblSessionstatus.regId, regId),
            eq(tblSessionstatus.sessionId, sessionId),
          ),
        );

      if (existing) {
        await this.db
          .update(tblSessionstatus)
          .set({
            sessionStatus: status,
            modifiedDate: new Date()
              .toISOString()
              .slice(0, 19)
              .replace('T', ' '),
          })
          .where(
            and(
              eq(tblSessionstatus.regId, regId),
              eq(tblSessionstatus.sessionId, sessionId),
            ),
          );

        return {
          success: true,
          message: 'Session status updated successfully',
        };
      } else {
        await this.db.insert(tblSessionstatus).values({
          sessionId,
          regId,
          programType: '0',
          sessionType: 0,
          isZoom: '0',
          sessionStatus: status,
          createdDate: new Date().toISOString(),
        });

        return {
          success: true,
          message: 'Session status created successfully',
        };
      }
    } catch (error) {
      console.error('Error updating session status:', error);
      throw error;
    }
  }
}
