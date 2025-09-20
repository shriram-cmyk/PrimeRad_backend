import { Injectable, Inject, NotFoundException } from '@nestjs/common';
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
  tblDicomObservationTitles,
  tblDicomUserObservations,
  tblDicomObsTitles,
  tblDicomUserObs,
  tblCrsections,
  tblEnrollments,
} from '../db/schema';
import { CreateQueryDto } from './dto/create-query-dto';
import { CreateQueryResponseDto } from './dto/create-query-response-dto';
import { and, eq, sql, or, gt, inArray } from 'drizzle-orm';
export class SubmitUserObservationDto {
  obsTitleId: number;
  userObs: string;
}

@Injectable()
export class FellowshipService {
  constructor(@Inject('DB') private readonly db: MySql2Database) {}

  async getCapturedProgramsByUser(regId: number, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      // Count total enrollments (no distinct/grouping needed now)
      const [countResult] = await this.db
        .select({ total: sql<number>`COUNT(*)` })
        .from(tblEnrollments)
        .where(
          and(
            eq(tblEnrollments.regId, regId),
            eq(tblEnrollments.payStatus, 'captured'),
          ),
        );

      const total = countResult?.total ?? 0;

      const programs = await this.db
        .select({
          programId: tblProgram.programId,
          programName: sql<string>`ANY_VALUE(${tblProgram.programName})`,
          programShortname: sql<string>`ANY_VALUE(${tblProgram.programShortname})`,
          programUrl: sql<string>`ANY_VALUE(${tblProgram.programUrl})`,
          programTitle: sql<string>`ANY_VALUE(${tblProgram.programTitle})`,
          programDescription: sql<string>`ANY_VALUE(${tblProgram.programDescription})`,
          programImage: sql<string>`
      ANY_VALUE(CONCAT('https://primeradacademy.com/admin/support/uploads/banners/', ${tblProgram.programImage}))
    `,
          programDuration: sql<string>`ANY_VALUE(${tblProgram.programDuration})`,

          batchId: tblBatch.batchId,
          batchName: sql<string>`CONCAT('Batch ', ${tblBatch.batchId})`,
          batchStart: sql<Date>`ANY_VALUE(${tblBatch.batchStartdate})`,
          batchEnd: sql<Date>`ANY_VALUE(${tblBatch.batchEnddate})`,
          moduleCount: sql<number>`ANY_VALUE(${tblBatch.modules})`,

          enrolledDate: sql<Date>`MIN(${tblEnrollments.enrolledDate})`,
          payStatus: sql<string>`MAX(${tblEnrollments.payStatus})`,
        })
        .from(tblEnrollments)
        .innerJoin(
          tblProgram,
          eq(tblEnrollments.programId, tblProgram.programId),
        )
        .innerJoin(tblBatch, eq(tblEnrollments.batchId, tblBatch.batchId))
        .where(
          and(
            eq(tblEnrollments.regId, regId),
            eq(tblEnrollments.payStatus, 'captured'),
          ),
        )
        .groupBy(tblEnrollments.programId, tblEnrollments.batchId)
        .orderBy(sql`MIN(${tblEnrollments.enrolledDate})`)
        .limit(limit);

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
      // --- Check if user purchased
      const [payment] = await this.db
        .select({ paymentId: tblPayments.paymentId })
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

      // --- Get batch-level counts
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

      // --- Normal Phases + Modules
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

      // --- Special Focus Tracks (crsections)
      const crsections = await this.db
        .select({
          crsectionId: tblCrsections.crsectionId,
          crsectionName: tblCrsections.crsectionName,
          crsectionDescription: tblCrsections.crsectionDescription,
        })
        .from(tblCrsections)
        .where(
          and(
            eq(tblCrsections.programId, programId),
            eq(tblCrsections.batchId, batchId),
            eq(tblCrsections.status, '1'),
          ),
        );

      const specialFocusTracks: any[] = [];
      for (const crs of crsections) {
        const crSessions = await this.db
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
              eq(tblSessions.crsectionId, crs.crsectionId),
            ),
          );

        if (crSessions.length > 0) {
          specialFocusTracks.push({
            trackTitle: crs.crsectionName || 'Special Focus',
            trackDescription: crs.crsectionDescription,
            sessions: crSessions,
          });
        }
      }

      return {
        success: true,
        counts: batchDetails ?? {},
        trackCount: phasesWithModules.length + specialFocusTracks.length,
        phases: phasesWithModules,
        specialFocus: specialFocusTracks, // 👈 new field
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
          sessions: { name: string; status: string }[];
          completedCount: number;
          totalCount: number;
        }
      > = {};

      for (const s of sessions) {
        const status = statuses.find(
          (st) => st.sessionId === s.sessionId,
        )?.sessionStatus;

        let statusText = 'Not Opened';
        if (status === '2') statusText = 'Completed';
        else if (status === '1') statusText = 'In Progress';

        if (!grouped[s.sessionType]) {
          grouped[s.sessionType] = {
            sessions: [],
            completedCount: 0,
            totalCount: 0,
          };
        }

        grouped[s.sessionType].sessions.push({
          name: s.sessionName,
          status: statusText,
        });

        // count totals
        grouped[s.sessionType].totalCount++;
        if (status === '2') {
          grouped[s.sessionType].completedCount++;
        }
      }

      const resultSessions: Record<string, { name: string; status: string }[]> =
        {};
      const progress: Record<string, number> = {};

      for (const key of Object.keys(grouped)) {
        const g = grouped[key];
        resultSessions[key] = g.sessions;

        // new completion percentage logic
        const completionPercentage =
          g.totalCount > 0
            ? Math.round((g.completedCount / g.totalCount) * 100)
            : 0;

        progress[key] = completionPercentage;
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

  async getObservationTitlesBySession(sessionId: number) {
    const titles = await this.db
      .select({
        observationTitle1: tblDicomObservationTitles.observationTitle1,
        observationTitle2: tblDicomObservationTitles.observationTitle2,
        observationTitle3: tblDicomObservationTitles.observationTitle3,
        observationTitle4: tblDicomObservationTitles.observationTitle4,
        observationTitle5: tblDicomObservationTitles.observationTitle5,
        observationTitle6: tblDicomObservationTitles.observationTitle6,
        observationTitle7: tblDicomObservationTitles.observationTitle7,
        observationTitle8: tblDicomObservationTitles.observationTitle8,
        observationTitle9: tblDicomObservationTitles.observationTitle9,
        observationTitle10: tblDicomObservationTitles.observationTitle10,
      })
      .from(tblDicomObservationTitles)
      .where(eq(tblDicomObservationTitles.sessionId, sessionId));

    return titles;
  }

  async getFacultyObservationsBySession(sessionId: number) {
    const records = await this.db
      .select({
        dicomObservationTitlesId:
          tblDicomObservationTitles.dicomObservationTitlesId,
        facultyObservation: tblDicomObservationTitles.facultyObservation,
        observationTitle1: tblDicomObservationTitles.observationTitle1,
        observationTitle2: tblDicomObservationTitles.observationTitle2,
        observationTitle3: tblDicomObservationTitles.observationTitle3,
        observationTitle4: tblDicomObservationTitles.observationTitle4,
        observationTitle5: tblDicomObservationTitles.observationTitle5,
        observationTitle6: tblDicomObservationTitles.observationTitle6,
        observationTitle7: tblDicomObservationTitles.observationTitle7,
        observationTitle8: tblDicomObservationTitles.observationTitle8,
        observationTitle9: tblDicomObservationTitles.observationTitle9,
        observationTitle10: tblDicomObservationTitles.observationTitle10,
      })
      .from(tblDicomObservationTitles)
      .where(
        and(
          eq(tblDicomObservationTitles.sessionId, sessionId),
          or(
            sql`${tblDicomObservationTitles.observationTitle1} != 'na'`,
            sql`${tblDicomObservationTitles.observationTitle2} != 'na'`,
            sql`${tblDicomObservationTitles.observationTitle3} != 'na'`,
            sql`${tblDicomObservationTitles.observationTitle4} != 'na'`,
            sql`${tblDicomObservationTitles.observationTitle5} != 'na'`,
            sql`${tblDicomObservationTitles.observationTitle6} != 'na'`,
            sql`${tblDicomObservationTitles.observationTitle7} != 'na'`,
            sql`${tblDicomObservationTitles.observationTitle8} != 'na'`,
            sql`${tblDicomObservationTitles.observationTitle9} != 'na'`,
            sql`${tblDicomObservationTitles.observationTitle10} != 'na'`,
          ),
        ),
      );

    return records.map((r) => {
      const titles = Object.keys(r)
        .filter((k) => k.startsWith('observationTitle') && r[k] !== 'na')
        .map((k) => r[k]);

      return {
        dicomObservationTitlesId: r.dicomObservationTitlesId,
        titles,
        facultyObservation: r.facultyObservation,
      };
    });
  }

  async submitUserObservations(dto: any, regId: any) {
    try {
      const data = {
        obsTitleId: dto.obsTitleId ?? null,
        regId: regId ?? null,
        userObs: dto.userObs ?? null,
      };

      console.log('Data to insert:', data);

      const titleExists = await this.db
        .select()
        .from(tblDicomObsTitles)
        .where(eq(tblDicomObsTitles.obsTitleId, data.obsTitleId))
        .limit(1);

      if (titleExists.length === 0) {
        throw new Error(
          `ObsTitleId ${data.obsTitleId} does not exist in tblDicomObsTitles`,
        );
      }

      const existingRecord = await this.db
        .select()
        .from(tblDicomUserObs)
        .where(
          and(
            eq(tblDicomUserObs.obsTitleId, data.obsTitleId),
            eq(tblDicomUserObs.regId, data.regId),
          ),
        )
        .limit(1);

      console.log(existingRecord);

      if (existingRecord.length > 0) {
        await this.db
          .update(tblDicomUserObs)
          .set({ userObs: data.userObs })
          .where(
            and(
              eq(tblDicomUserObs.obsTitleId, data.obsTitleId),
              eq(tblDicomUserObs.regId, data.regId),
            ),
          );

        return {
          success: true,
          message: 'User observations updated successfully',
        };
      } else {
        await this.db.insert(tblDicomUserObs).values(data);
        return {
          success: true,
          message: 'User observations saved successfully',
        };
      }
    } catch (error) {
      console.error('Error in submitUserObservations:', error);
      throw new Error(`Failed to save user observations: ${error.message}`);
    }
  }

  async compareObservations(sessionId: number, regId: number) {
    const facultyRecords = await this.db
      .select({
        obsTitleId: tblDicomObsTitles.obsTitleId,
        observationTitle: tblDicomObsTitles.observationTitle,
        facultyObservation: tblDicomObsTitles.facultyObservation,
      })
      .from(tblDicomObsTitles)
      .where(eq(tblDicomObsTitles.sessionId, sessionId));

    const userRecords = await this.db
      .select({
        obsTitleId: tblDicomUserObs.obsTitleId,
        userObs: tblDicomUserObs.userObs,
      })
      .from(tblDicomUserObs)
      .innerJoin(
        tblDicomObsTitles,
        eq(tblDicomUserObs.obsTitleId, tblDicomObsTitles.obsTitleId),
      )
      .where(
        and(
          eq(tblDicomObsTitles.sessionId, sessionId),
          eq(tblDicomUserObs.regId, regId),
        ),
      );

    const parsedUserRecords = userRecords.map((record) => {
      let observations: any;
      try {
        observations = JSON.parse(record.userObs ?? '');
        if (!Array.isArray(observations)) {
          observations = [record.userObs];
        }
      } catch (error) {
        observations = [record.userObs];
      }

      return {
        obsTitleId: record.obsTitleId,
        observations: observations,
      };
    });

    const processedFacultyRecords = facultyRecords.map((record) => {
      return {
        obsTitleId: record.obsTitleId,
        observationTitle: record.observationTitle,
        facultyObservation:
          record.facultyObservation && record.facultyObservation.trim() !== ''
            ? record.facultyObservation
            : null,
      };
    });

    const facultyWithData = processedFacultyRecords.filter(
      (record) => record.facultyObservation !== null,
    );

    const finalFacultyRecords =
      facultyWithData.length === 1 &&
      processedFacultyRecords[0].facultyObservation
        ? [processedFacultyRecords[0]]
        : processedFacultyRecords;

    return {
      userObservations: parsedUserRecords,
      facultyObservations: finalFacultyRecords,
    };
  }

  async getDicomVideoUrl(sessionId: number) {
    const [session] = await this.db
      .select({
        dicomVideoUrl: tblSessions.dicomVideoUrl,
      })
      .from(tblSessions)
      .where(eq(tblSessions.sessionId, sessionId));

    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    return session.dicomVideoUrl ?? '';
  }
}
