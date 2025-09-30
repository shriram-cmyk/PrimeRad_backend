import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import slugify from 'slugify';
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
  tblProgramPrices,
} from '../db/schema';
import { CreateQueryDto } from './dto/create-query-dto';
import { CreateQueryResponseDto } from './dto/create-query-response-dto';
import { and, eq, sql, or, gt, inArray, like } from 'drizzle-orm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from '@nestjs/cache-manager';

export class SubmitUserObservationDto {
  obsTitleId: number;
  userObs: string;
}

@Injectable()
export class FellowshipService {
  constructor(
    @Inject('DB') private readonly db: MySql2Database,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async timedQuery<T>(
    queryPromise: Promise<T>,
    label = 'DB Query',
  ): Promise<T> {
    const start = Date.now();
    const result = await queryPromise;
    const dbTime = Date.now() - start;
    console.log(`⏱️ ${label} took ${dbTime} ms`);
    return result;
  }

  async getCapturedProgramsByUser(regId: number, page = 1, limit = 10) {
    try {
      const cacheKey = `capturedPrograms:${regId}:${page}:${limit}`;

      // Check Redis cache first
      const cachedData = await this.cacheManager.get(cacheKey);
      if (cachedData) {
        console.log('Cache hit:', cacheKey);
        return cachedData;
      }

      const offset = (page - 1) * limit;

      const [programs] = await Promise.all([
        this.timedQuery(
          this.db
            .select({
              programId: tblProgram.programId,
              programName: sql<string>`ANY_VALUE(${tblProgram.programName})`,
              programShortname: sql<string>`ANY_VALUE(${tblProgram.programShortname})`,
              programUrl: sql<string>`ANY_VALUE(${tblProgram.programUrl})`,
              programTitle: sql<string>`ANY_VALUE(${tblProgram.programTitle})`,
              programDescription: sql<string>`ANY_VALUE(${tblProgram.programDescription})`,
              programImage: sql<string>`ANY_VALUE(CONCAT('https://primeradacademy.com/admin/support/uploads/banners/', ${tblProgram.programImage}))`,
              programDuration: sql<string>`ANY_VALUE(${tblProgram.programDuration})`,

              batchId: tblBatch.batchId,
              batchName: sql<string>`CONCAT('Batch ', ANY_VALUE(${tblBatch.batchId}))`,
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
            .limit(limit)
            .offset(offset),
        ),
      ]);

      const total = programs.length ?? 0;

      const result = {
        success: true,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        data: programs,
      };

      await this.cacheManager.set(cacheKey, result, { ttl: 43200 } as any);

      return result;
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  }

  async getProgramDetails(programId: number, batchId: number) {
    try {
      const cacheKey = `programDetails:${programId}:${batchId}`;

      // First check cache
      const cachedData = await this.cacheManager.get(cacheKey);
      if (cachedData) {
        console.log('Cache hit:', cacheKey);
        return cachedData;
      }

      // Fetch program + batch details
      const [program] = await this.db
        .select({
          programId: tblProgram.programId,
          programName: tblProgram.programName,
          programShortname: tblProgram.programShortname,
          programUrl: tblProgram.programUrl,
          programTitle: tblProgram.programTitle,
          programDescription: tblProgram.programDescription,
          programImage: sql<string>`CONCAT('https://primeradacademy.com/admin/support/uploads/banners/', ${tblProgram.programImage})`,
          programDuration: tblProgram.programDuration,

          batchId: tblBatch.batchId,
          batchName: sql<string>`CONCAT('Batch ', ${tblBatch.batchId})`,
          batchStart: tblBatch.batchStartdate,
          batchEnd: tblBatch.batchEnddate,
          moduleCount: tblBatch.modules,
          // sessionCount: tblBatch.sessions,
        })
        .from(tblProgram)
        .innerJoin(tblBatch, eq(tblProgram.programId, tblBatch.programId))
        .where(
          and(
            eq(tblProgram.programId, programId),
            eq(tblBatch.batchId, batchId),
          ),
        )
        .limit(1);

      if (!program) {
        return {
          success: false,
          message: 'Program not found',
        };
      }

      // Fetch program prices in INR for both student & consultant
      const prices = await this.db
        .select({
          designation: tblProgramPrices.designation,
          currency: tblProgramPrices.currency,
          displayPrice: tblProgramPrices.displayPrice,
          fullAmount: tblProgramPrices.fullAmount,
          totalInstallmentAmount: tblProgramPrices.totalInstallmentAmount,
          installmentPay1: tblProgramPrices.installmentPay1,
          installmentPay2: tblProgramPrices.installmentPay2,
          installmentPay3: tblProgramPrices.installmentPay3,
        })
        .from(tblProgramPrices)
        .where(
          and(
            eq(tblProgramPrices.programId, programId),
            eq(tblProgramPrices.batchId, batchId),
            eq(tblProgramPrices.currency, 'INR'), // filter for INR
            inArray(tblProgramPrices.designation, ['student', 'consultant']),
          ),
        );

      const result = {
        success: true,
        data: {
          ...program,
          prices,
        },
      };

      // Cache it for 12 hours
      await this.cacheManager.set(cacheKey, result, { ttl: 43200 } as any);

      return result;
    } catch (error) {
      console.error('Error fetching program details:', error);
      throw error;
    }
  }

  async getAllPrograms(page = 1, limit = 10, regId?: number) {
    try {
      const cacheKey = `allPrograms:${page}:${limit}:user:${regId ?? 'guest'}`;
      const cachedData = await this.cacheManager.get(cacheKey);
      if (cachedData) return cachedData;

      const offset = (page - 1) * limit;

      const programs = await this.timedQuery(
        this.db
          .select({
            programId: tblProgram.programId,
            programName: tblProgram.programName,
            programShortname: tblProgram.programShortname,
            programUrl: tblProgram.programUrl,
            programTitle: tblProgram.programTitle,
            programDescription: tblProgram.programDescription,
            programImage: sql<string>`CONCAT('https://primeradacademy.com/admin/support/uploads/banners/', ${tblProgram.programImage})`,
            programDuration: tblProgram.programDuration,
            batchId: tblBatch.batchId,
            batchName: sql<string>`CONCAT('Batch ', ${tblBatch.batchId})`,
            batchStart: tblBatch.batchStartdate,
            batchEnd: tblBatch.batchEnddate,
            moduleCount: tblBatch.modules,
          })
          .from(tblProgram)
          .innerJoin(tblBatch, eq(tblProgram.programId, tblBatch.programId))
          .orderBy(tblBatch.batchStartdate)
          .limit(limit)
          .offset(offset),
      );

      const programIds = programs.map((p) => p.programId);
      const batchIds = programs.map((p) => p.batchId);

      const prices = await this.db
        .select()
        .from(tblProgramPrices)
        .where(
          and(
            inArray(tblProgramPrices.programId, programIds),
            inArray(tblProgramPrices.batchId, batchIds),
          ),
        );

      let userPayments: any[] = [];
      if (regId) {
        userPayments = await this.db
          .select({
            programId: tblPayments.programId,
            batchId: tblPayments.batchId,
            payStatus: tblPayments.payStatus,
          })
          .from(tblPayments)
          .where(
            and(
              inArray(tblPayments.programId, programIds),
              eq(tblPayments.regId, regId),
            ),
          );
      }

      const enrolledCounts = await this.db
        .select({
          programId: tblPayments.programId,
          batchId: tblPayments.batchId,
          enrolled: sql<number>`COUNT(*)`,
        })
        .from(tblPayments)
        .where(
          and(
            inArray(tblPayments.programId, programIds),
            eq(tblPayments.payStatus, 'captured'),
          ),
        )
        .groupBy(tblPayments.programId, tblPayments.batchId);

      const dataWithSEO = programs.map((p) => {
        const programPrices = prices.filter(
          (pr) => pr.programId === p.programId && pr.batchId === p.batchId,
        );

        const enrolledCountObj = enrolledCounts.find(
          (pay) => pay.programId === p.programId && pay.batchId === p.batchId,
        );

        const userPayment = userPayments.find(
          (up) => up.programId === p.programId && up.batchId === p.batchId,
        );

        return {
          ...p,
          prices: programPrices,
          enrolled: enrolledCountObj?.enrolled ?? 0,
          isEnrolled: userPayment?.payStatus === 'captured',
          programSlug: slugify(p.programName, { lower: true, strict: true }),
          batchSlug: `${slugify(p.programName, { lower: true, strict: true })}-batch-${p.batchId}`,
          seoTitle: p.programTitle,
          seoDescription: p.programDescription,
          canonicalUrl: `${p.programUrl}/${slugify(p.programName, { lower: true, strict: true })}/${p.batchId}`,
          ogImage:
            p.programImage ?? 'https://primeradacademy.com/default-image.jpg',
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: p.programTitle,
            description: p.programDescription,
            provider: {
              '@type': 'Organization',
              name: 'PrimeRad Academy',
              sameAs: p.programUrl,
            },
            hasCourseInstance: {
              '@type': 'CourseInstance',
              courseMode: 'Full-time',
              startDate: p.batchStart,
              endDate: p.batchEnd,
            },
          },
        };
      });

      const total = programs.length ?? 0;

      const result = {
        success: true,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        data: dataWithSEO,
      };

      await this.cacheManager.set(cacheKey, result, { ttl: 43200 } as any);
      return result;
    } catch (error) {
      console.error('Error fetching all programs:', error);
      throw error;
    }
  }

  async getProgramDetailsByUser(
    regId: number,
    programId: number,
    batchId: number,
  ) {
    try {
      // 1. Check payment status first
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

      // 2. Get batch details
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

      // 3. Get all phases for this program and batch
      const phases = await this.db
        .select({
          phaseId: tblPhases.phaseId,
          phaseName: tblPhases.phaseName,
          phaseDescription: tblPhases.phaseDescription,
          phaseImage: tblPhases.phaseImage,
          phaseStart: tblPhases.phaseStartDate,
          phaseEnd: tblPhases.phaseEndDate,
        })
        .from(tblPhases);
      // .where(and(eq(tblPhases.programId, programId)));

      const allModules = await this.db
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
            // eq(tblModules.batchId, batchId),
          ),
        );

      const allSessions = await this.db
        .select({
          sessionId: tblSessions.sessionId,
          phaseId: tblSessions.phaseId,
          moduleId: tblSessions.moduleId,
          sessionName: tblSessions.sessionName,
          sessionType: tblSessions.sessionType,
        })
        .from(tblSessions)
        .where(
          and(
            eq(tblSessions.programId, programId),
            eq(tblSessions.batchId, batchId),
          ),
        );

      const sessionIds = allSessions.map((s) => s.sessionId);
      const allSessionStatuses =
        sessionIds.length > 0
          ? await this.db
              .select({
                sessionId: tblSessionstatus.sessionId,
                sessionStatus: tblSessionstatus.sessionStatus,
              })
              .from(tblSessionstatus)
              .where(
                and(
                  inArray(tblSessionstatus.sessionId, sessionIds),
                  eq(tblSessionstatus.regId, regId), // Assuming regId is used to track user
                ),
              )
          : [];

      // 7. Create lookup maps for better performance
      const sessionStatusMap = new Map(
        allSessionStatuses.map((s) => [s.sessionId, s.sessionStatus]),
      );

      // 8. Process each phase with modules and their progress
      const phasesWithModules = phases.map((phase) => {
        // Get sessions for this phase
        const phaseSessions = allSessions.filter(
          (s) => s.phaseId === phase.phaseId,
        );

        // Calculate phase-level session statistics
        const phaseTotalSessions = phaseSessions.length;
        const phaseCompletedSessions = phaseSessions.filter(
          (s) => sessionStatusMap.get(s.sessionId) === '2',
        ).length;
        const phaseInProgressSessions = phaseSessions.filter(
          (s) => sessionStatusMap.get(s.sessionId) === '1',
        ).length;
        const phaseNotOpenedSessions =
          phaseTotalSessions -
          (phaseCompletedSessions + phaseInProgressSessions);
        const phaseCompletionPercentage =
          phaseTotalSessions > 0
            ? Math.round((phaseCompletedSessions / phaseTotalSessions) * 100)
            : 0;

        // Process modules for this phase
        const modulesWithProgress = allModules.map((module) => {
          // Get sessions for this module in this phase
          const moduleSessions = phaseSessions.filter(
            (s) => s.moduleId === module.moduleId,
          );

          const totalSessions = moduleSessions.length;
          const completedSessions = moduleSessions.filter(
            (s) => sessionStatusMap.get(s.sessionId) === '2',
          ).length;
          const inProgressSessions = moduleSessions.filter(
            (s) => sessionStatusMap.get(s.sessionId) === '1',
          ).length;
          const notOpenedSessions =
            totalSessions - (completedSessions + inProgressSessions);
          const completionPercentage =
            totalSessions > 0
              ? Math.round((completedSessions / totalSessions) * 100)
              : 0;

          return {
            ...module,
            totalSessions,
            completedSessions,
            inProgressSessions,
            notOpenedSessions,
            completionPercentage,
          };
        });

        return {
          ...phase,
          moduleCount: modulesWithProgress.length,
          summary: {
            totalSessions: phaseTotalSessions,
            completedSessions: phaseCompletedSessions,
            inProgressSessions: phaseInProgressSessions,
            notOpenedSessions: phaseNotOpenedSessions,
            completionPercentage: phaseCompletionPercentage,
          },
          modules: modulesWithProgress,
        };
      });

      // 9. Calculate global statistics
      const globalTotalSessions = allSessions.length;
      const globalCompletedSessions = allSessions.filter(
        (s) => sessionStatusMap.get(s.sessionId) === '2',
      ).length;
      const globalInProgressSessions = allSessions.filter(
        (s) => sessionStatusMap.get(s.sessionId) === '1',
      ).length;
      const globalNotOpenedSessions =
        globalTotalSessions -
        (globalCompletedSessions + globalInProgressSessions);

      return {
        success: true,
        counts: {
          ...batchDetails,
          totalSessions: globalTotalSessions,
          completedSessions: globalCompletedSessions,
          inProgressSessions: globalInProgressSessions,
          notOpenedSessions: globalNotOpenedSessions,
        },
        trackCount: phasesWithModules.length,
        phases: phasesWithModules,
      };
    } catch (error) {
      console.error('Error fetching program details:', error);
      throw error;
    }
  }

  async getProgramSampleDetails(programId: number, batchId: number) {
    try {
      // 1. Get batch details
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

      // 2. Get all phases
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
            // eq(tblPhases.batchId, batchId),
          ),
        );

      // 3. Get all modules (limit to 3)
      const allModules = (
        await this.db
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
              // eq(tblModules.batchId, batchId),
            ),
          )
      ).slice(0, 3);

      const allSessions = await this.db
        .select({
          sessionId: tblSessions.sessionId,
          phaseId: tblSessions.phaseId,
          moduleId: tblSessions.moduleId,
          sessionName: tblSessions.sessionName,
          sessionType: tblSessions.sessionType,
        })
        .from(tblSessions)
        .where(
          and(
            eq(tblSessions.programId, programId),
            eq(tblSessions.batchId, batchId),
          ),
        );

      // 5. Build sample data (3 distinct sessionTypes per module)
      const sampleModules = allModules.map((module) => {
        const moduleSessions = allSessions.filter(
          (s) => s.moduleId === module.moduleId,
        );

        const seenTypes = new Set<string>();
        const distinctSessions: typeof moduleSessions = [];

        for (const s of moduleSessions) {
          if (!seenTypes.has(s.sessionType) && distinctSessions.length < 3) {
            seenTypes.add(s.sessionType);
            distinctSessions.push(s);
          }
        }

        return {
          ...module,
          sessions: distinctSessions,
        };
      });

      const phasesWithModules = phases.map((phase) => {
        return {
          ...phase,
          modules: sampleModules.map((m) => ({
            ...m,
            sessions: m.sessions.filter((s) => s.phaseId === phase.phaseId),
          })),
        };
      });

      return {
        success: true,
        counts: batchDetails,
        trackCount: phasesWithModules.length,
        phases: phasesWithModules,
      };
    } catch (error) {
      console.error('Error fetching sample program details:', error);
      throw error;
    }
  }

  async getSessionsByModule(
    regId: number,
    programId: number,
    batchId: number,
    phaseId: number,
    moduleId: number,
  ) {
    try {
      const cacheKey = `sessions:${regId}:${programId}:${batchId}:${phaseId}:${moduleId}`;

      // 1. Try cache first
      const cached = await this.cacheManager.get(cacheKey);
      if (cached) {
        return cached; // ✅ Return cached response
      }
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

      // FIX: Add regId filter to get statuses only for this user
      const statuses =
        sessionIds.length > 0
          ? await this.db
              .select({
                sessionId: tblSessionstatus.sessionId,
                sessionStatus: tblSessionstatus.sessionStatus,
              })
              .from(tblSessionstatus)
              .where(
                and(
                  inArray(tblSessionstatus.sessionId, sessionIds),
                  eq(tblSessionstatus.regId, regId), // Filter by user
                ),
              )
          : [];

      // Create a map for faster lookup
      const statusMap = new Map(
        statuses.map((s) => [s.sessionId, s.sessionStatus]),
      );

      const grouped: Record<
        string,
        {
          sessions: { sessionId: number; name: string; status: string }[];
          completedCount: number;
          totalCount: number;
        }
      > = {};

      for (const s of sessions) {
        const status = statusMap.get(s.sessionId);

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
          sessionId: s.sessionId, // Include sessionId for reference
          name: s.sessionName,
          status: statusText,
        });

        // count totals
        grouped[s.sessionType].totalCount++;
        if (status === '2') {
          grouped[s.sessionType].completedCount++;
        }
      }

      const resultSessions: Record<
        string,
        { sessionId: number; name: string; status: string }[]
      > = {};
      const progress: Record<string, number> = {};

      for (const key of Object.keys(grouped)) {
        const g = grouped[key];
        resultSessions[key] = g.sessions;

        // completion percentage logic
        const completionPercentage =
          g.totalCount > 0
            ? Math.round((g.completedCount / g.totalCount) * 100)
            : 0;

        progress[key] = completionPercentage;
      }
      const response = {
        success: true,
        sessions: resultSessions,
        progress,
      };

      // 3. Store in cache for next time
      await this.cacheManager.set(cacheKey, response, { ttl: 300 } as any); // 5 min

      return response;
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

  async getSessionDetails(sessionId: number, regId: number) {
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
        sessionId: session.sessionId,
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

      const sessionStatusRecord = await this.db
        .select({
          sessionStatus: tblSessionstatus.sessionStatus,
        })
        .from(tblSessionstatus)
        .where(
          and(
            eq(tblSessionstatus.sessionId, sessionId),
            eq(tblSessionstatus.regId, regId),
          ),
        )

        .limit(1)
        .then((rows) => rows[0]);

      console.log(sessionStatusRecord, 'session status record');

      let sessionStatus = 'Not Opened';
      if (sessionStatusRecord) {
        switch (sessionStatusRecord.sessionStatus) {
          case '1':
            sessionStatus = 'In Progress';
            break;
          case '2':
            sessionStatus = 'Completed';
            break;
          case '0':
            sessionStatus = 'Not Opened';
            break;
          default:
            sessionStatus = 'Not Opened';
            break;
        }
      }
      console.log(
        'Session Status',
        sessionStatus,
        sessionStatusRecord?.sessionStatus,
      );
      return {
        success: true,
        data: {
          currentSession: details,
          faculty,
          resources,
          nextSessions,
          sessionStatus,
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
      // Fetch answers joined with question info
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

      if (!answers.length) {
        return {
          success: true,
          status: 'not-taken',
          data: [],
        };
      }

      // Get total questions count
      const totalQuestionsCountResult = await this.db
        .select({
          count: sql<number>`COUNT(*)`,
        })
        .from(tblAssessmentQuestion)
        .where(eq(tblAssessmentQuestion.sessionId, sessionId));

      const totalQuestionsCount = Number(
        totalQuestionsCountResult[0]?.count ?? 0,
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

      const correctCount = formatted.filter((q) => q.isCorrect).length;

      const status =
        answers.length === totalQuestionsCount ? 'already-done' : 'partial';

      return {
        success: true,
        status,
        stats: {
          totalQuestions: totalQuestionsCount,
          correctAnswers: correctCount,
        },
        data: formatted,
      };
    } catch (error) {
      console.error(
        `Error fetching assessment answers for sessionId=${sessionId}, regId=${regId}:`,
        error,
      );
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

  async searchSimilarQuestions(partialMessage: string) {
    if (!partialMessage) return [];

    const results = await this.db
      .select()
      .from(tblQueries)
      .where(like(tblQueries.message, `%${partialMessage}%`)) // correct LIKE
      .limit(10);

    return results.map((r) => ({
      queriesId: r.queriesId,
      message: r.message,
      anonymous: r.anonymous,
      createdDate: r.createdDate,
    }));
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
          createdDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
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

  async submitUserObservations(dtos: any[], regId: any) {
    try {
      if (!Array.isArray(dtos)) {
        throw new Error('Expected an array of observations');
      }

      const results: any = [];

      for (const dto of dtos) {
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
          results.push({
            success: false,
            message: `ObsTitleId ${data.obsTitleId} does not exist in tblDicomObsTitles`,
          });
          continue;
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

          results.push({
            success: true,
            message: `Updated obsTitleId ${data.obsTitleId} for regId ${data.regId}`,
          });
        } else {
          await this.db.insert(tblDicomUserObs).values(data);

          results.push({
            success: true,
            message: `Inserted obsTitleId ${data.obsTitleId} for regId ${data.regId}`,
          });
        }
      }

      return {
        success: true,
        results,
      };
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

  async updatePaymentAndEnrollment(
    regId: number,
    programId: number,
    batchId: number,
    paymentData: {
      orderId: string;
      payStatus: string;
      finalAmount: string;
      paymentOption: string;
      programName: string;
      currency: string;
      paymentDate: string;
    },
  ) {
    const trx = await this.db.transaction(async (tx: any) => {
      try {
        // --- Step 1: Insert into tblPayments ---
        await tx.insert(tblPayments).values({
          regId,
          programId,
          batchId,
          paidFor: 1,
          programName: paymentData.programName,
          paymentOption: paymentData.paymentOption,
          programAmount: paymentData.finalAmount,
          currency: paymentData.currency,
          orderId: paymentData.orderId,
          paySession: '1',
          redeemAmount: 0,
          advanceAmount: 0,
          subtotalAmount: paymentData.finalAmount,
          taxAmount: '0',
          finalAmount: paymentData.finalAmount,
          accessStatus: '1',
          paymentDate: paymentData.paymentDate,
          payStatus: paymentData.payStatus,
        });

        // --- Step 2: Update or Insert into tblEnrollments ---
        const [existingEnrollment] = await tx
          .select()
          .from(tblEnrollments)
          .where(
            and(
              eq(tblEnrollments.regId, regId),
              eq(tblEnrollments.programId, programId),
              eq(tblEnrollments.batchId, batchId),
            ),
          );

        if (existingEnrollment) {
          await tx
            .update(tblEnrollments)
            .set({
              payStatus: paymentData.payStatus as
                | 'pending'
                | 'captured'
                | 'failed',
              enrolledDate: paymentData.paymentDate,
            })
            .where(
              and(
                eq(tblEnrollments.regId, regId),
                eq(tblEnrollments.programId, programId),
                eq(tblEnrollments.batchId, batchId),
              ),
            );
        } else {
          await tx.insert(tblEnrollments).values({
            regId,
            programId,
            batchId,
            payStatus: paymentData.payStatus as
              | 'pending'
              | 'captured'
              | 'failed',
            enrolledDate: paymentData.paymentDate,
          });
        }

        return {
          success: true,
          message: 'Payment and enrollment updated successfully',
        };
      } catch (error) {
        console.error('Transaction failed:', error);
        throw error;
      }
    });

    return trx;
  }
}
