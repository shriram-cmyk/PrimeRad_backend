import { Test, TestingModule } from '@nestjs/testing';
import { FellowshipService } from './fellowship.service';
import { MySql2Database } from 'drizzle-orm/mysql2';

describe('FellowshipService', () => {
  let service: FellowshipService;
  let mockDb: any;

  beforeEach(async () => {
    // Create a mock database that supports method chaining
    mockDb = {
      select: jest.fn(),
      from: jest.fn(),
      where: jest.fn(),
      leftJoin: jest.fn(),
      innerJoin: jest.fn(),
      limit: jest.fn(),
      offset: jest.fn(),
      orderBy: jest.fn(),
      insert: jest.fn(),
      values: jest.fn(),
      $returningId: jest.fn(),
    };

    // Set up default chaining behavior
    mockDb.select.mockReturnValue(mockDb);
    mockDb.from.mockReturnValue(mockDb);
    mockDb.where.mockReturnValue(mockDb);
    mockDb.leftJoin.mockReturnValue(mockDb);
    mockDb.innerJoin.mockReturnValue(mockDb);
    mockDb.limit.mockReturnValue(mockDb);
    mockDb.offset.mockReturnValue(mockDb);
    mockDb.orderBy.mockReturnValue(mockDb);
    mockDb.insert.mockReturnValue(mockDb);
    mockDb.values.mockReturnValue(mockDb);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FellowshipService,
        {
          provide: 'DB',
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<FellowshipService>(FellowshipService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCapturedProgramsByUser', () => {
    it('should return captured programs with pagination', async () => {
      const mockCountResult = [{ count: 1 }];
      const mockPrograms = [
        {
          programId: 1,
          programName: 'Test Program',
          programShortname: 'TP',
          programUrl: 'test-program',
          programTitle: 'Test Program Title',
          programDescription: 'Test Description',
          programImage: 'test.jpg',
          programDuration: '6 months',
          batchId: 1,
          batchName: 'Batch 1',
          batchStart: new Date('2024-01-01'),
          batchEnd: new Date('2024-06-30'),
          enrolledDate: new Date('2024-01-01'),
          moduleCount: 5,
          payStatus: 'captured',
        },
      ];

      // Mock the final call results for both queries
      // First query (count) - chains through select -> from -> where
      mockDb.where.mockResolvedValueOnce(mockCountResult);

      // Second query (programs) - chains through select -> from -> leftJoin -> leftJoin -> where -> limit -> offset
      mockDb.offset.mockResolvedValueOnce(mockPrograms);

      const result = await service.getCapturedProgramsByUser(1, 1, 10);

      expect(result).toEqual({
        success: true,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
        data: mockPrograms,
      });

      expect(mockDb.select).toHaveBeenCalledTimes(2);
      expect(mockDb.from).toHaveBeenCalledTimes(2);
      expect(mockDb.where).toHaveBeenCalled();
      expect(mockDb.limit).toHaveBeenCalled();
      expect(mockDb.offset).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      mockDb.where.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.getCapturedProgramsByUser(1)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('getProgramDetailsByUser', () => {
    it('should return program details when user has access', async () => {
      const mockPaymentResult = [{ paymentId: 1 }];
      const mockBatchDetails = [
        {
          modulesCount: 5,
          videosCount: 10,
          dicomCount: 2,
          assessmentCount: 3,
          certificateCount: 1,
          meetingCount: 8,
        },
      ];
      const mockPhases = [
        {
          phaseId: 1,
          phaseName: 'Phase 1',
          phaseDescription: 'Test Phase',
          phaseImage: 'phase.jpg',
          phaseStartDate: new Date('2024-01-01'),
          phaseEndDate: new Date('2024-03-01'),
        },
      ];
      const mockModules = [
        {
          moduleId: 1,
          moduleName: 'Module 1',
          moduleDescription: 'Test Module',
          moduleImage: 'module.jpg',
          moduleStartdate: new Date('2024-01-01'),
          module2Startdate: new Date('2024-01-15'),
          module3Startdate: new Date('2024-02-01'),
          programType: 'online',
        },
      ];

      // Mock sequential query results
      mockDb.where
        .mockResolvedValueOnce(mockPaymentResult) // Payment check
        .mockResolvedValueOnce(mockBatchDetails) // Batch details
        .mockResolvedValueOnce(mockPhases) // Phases
        .mockResolvedValueOnce(mockModules); // Modules for phase

      const result: any = await service.getProgramDetailsByUser(1, 1, 1);

      expect(result.success).toBe(true);
      expect(result.counts).toEqual(mockBatchDetails[0]);
      expect(result.trackCount).toBe(1);
      expect(result.phases).toHaveLength(1);
      expect(result.phases[0].moduleCount).toBe(1);
    });

    it('should return error when user has no access', async () => {
      mockDb.where.mockResolvedValueOnce([]);

      const result = await service.getProgramDetailsByUser(1, 1, 1);

      expect(result).toEqual({
        success: false,
        message: 'User has not purchased this program or batch.',
      });
    });
  });

  describe('getSessionsByModule', () => {
    it('should return grouped sessions by type with progress', async () => {
      const mockSessions = [
        { sessionId: 1, sessionName: 'Session 1', sessionType: 'Video' },
        { sessionId: 2, sessionName: 'Session 2', sessionType: 'Video' },
        { sessionId: 3, sessionName: 'Session 3', sessionType: 'Live' },
      ];

      const mockStatuses = [
        { sessionId: 1, sessionStatus: '2' }, // completed
        { sessionId: 2, sessionStatus: '1' }, // in progress
        { sessionId: 3, sessionStatus: '2' }, // completed
      ];

      // Mock sessions query
      mockDb.select.mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce(mockSessions),
        }),
      });

      // Mock statuses query
      mockDb.select.mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce(mockStatuses),
        }),
      });

      const result = await service.getSessionsByModule(1, 1, 1, 1);

      expect(result).toEqual({
        success: true,
        sessions: {
          Video: [
            { name: 'Session 1', progress: 100 },
            { name: 'Session 2', progress: 50 },
          ],
          Live: [{ name: 'Session 3', progress: 100 }],
        },
        progress: {
          Video: 75, // average of 100 and 50
          Live: 100,
        },
      });
    });
  });

  describe('getAllSessions', () => {
    it('should return all sessions with pagination', async () => {
      const mockCountResult = [{ count: 2 }];
      const mockSessions = [
        {
          sessionName: 'Session 1',
          sessionType: 'Video',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-01'),
        },
        {
          sessionName: 'Session 2',
          sessionType: 'Live',
          startDate: new Date('2024-01-02'),
          endDate: new Date('2024-01-02'),
        },
      ];

      // Mock the count query (select -> from -> resolve)
      mockDb.from
        .mockReturnValueOnce(mockCountResult) // First query returns count directly
        .mockReturnValueOnce(mockDb); // Second query continues chaining

      // Mock the sessions query (select -> from -> limit -> offset -> resolve)
      mockDb.offset.mockResolvedValueOnce(mockSessions);

      const result = await service.getAllSessions(1, 10);

      expect(result).toEqual({
        success: true,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
        data: mockSessions,
      });
    });
  });

  describe('getSessionDetails', () => {
    it('should return session details for video session', async () => {
      const mockSessionResult = [
        {
          sessionId: 1,
          duration: 60,
          sessionImage: 'session.jpg',
          sessionName: 'Test Session',
          sessionType: 'Video',
          sessionUrl: 'http://test.com',
          isZoom: '0',
          zoomMeetingId: null,
          zoomStartdate: null,
          zoomEnddate: null,
          zoomPassword: null,
          zoomLiveLink: null,
          dicomVideoUrl: null,
          dicomCaseId: null,
        },
      ];
      const mockFaculty = [
        {
          facultyId: 1,
          facultyName: 'Dr. Test',
          facultyType: 'Primary',
          facultyImage: 'faculty.jpg',
          facultyLocation: 'Test City',
          facultyCountry: 'Test Country',
        },
      ];
      const mockResources = [
        {
          fileType: 'pdf',
          displayName: 'Test Resource',
          linkName: 'test.pdf',
          fileName: 'test.pdf',
        },
      ];
      const mockNextSessions = [
        {
          sessionName: 'Next Session',
          moduleName: 'Next Module',
          sessionImage: 'next.jpg',
        },
      ];

      mockDb.where
        .mockResolvedValueOnce(mockSessionResult)
        .mockResolvedValueOnce(mockFaculty)
        .mockResolvedValueOnce(mockResources);

      mockDb.limit.mockResolvedValueOnce(mockNextSessions);

      const result: any = await service.getSessionDetails(1);

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('currentSession');
      expect(result.data).toHaveProperty('faculty');
      expect(result.data).toHaveProperty('resources');
      expect(result.data).toHaveProperty('nextSessions');
      expect(result.data.currentSession.sessionUrl).toBe('http://test.com');
    });

    it('should return session details for live session', async () => {
      const mockLiveSession = [
        {
          sessionId: 1,
          duration: 60,
          sessionImage: 'session.jpg',
          sessionName: 'Live Session',
          sessionType: 'Live',
          sessionUrl: 'http://test.com',
          isZoom: '1',
          zoomMeetingId: '123456789',
          zoomStartdate: new Date('2024-01-01T10:00:00Z'),
          zoomEnddate: new Date('2024-01-01T11:00:00Z'),
          zoomPassword: 'password',
          zoomLiveLink: 'https://zoom.us/j/123456789',
          dicomVideoUrl: null,
          dicomCaseId: null,
        },
      ];

      mockDb.where
        .mockResolvedValueOnce(mockLiveSession)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      mockDb.limit.mockResolvedValueOnce([]);

      const result: any = await service.getSessionDetails(1);

      expect(result.success).toBe(true);
      expect(result.data.currentSession).toHaveProperty('zoomMeetingId');
      expect(result.data.currentSession).toHaveProperty('zoomLiveLink');
    });

    it('should return error when session not found', async () => {
      mockDb.where.mockResolvedValueOnce([]);

      const result = await service.getSessionDetails(999);

      expect(result).toEqual({
        success: false,
        message: 'Session not found',
      });
    });
  });

  describe('getAssessmentQuestions', () => {
    it('should return assessment questions', async () => {
      const mockQuestions = [
        {
          assessmentQuestionId: 1,
          assessmentQuestion: 'Test Question?',
          assessmentQuestionDescription: 'Test Description',
          answerOptionA: 'Option A',
          answerOptionB: 'Option B',
          answerOptionC: 'Option C',
          answerOptionD: 'Option D',
          questionImage: 'question.jpg',
        },
      ];

      mockDb.where.mockResolvedValueOnce(mockQuestions);

      const result = await service.getAssessmentQuestions(1);

      expect(result).toEqual({
        success: true,
        data: mockQuestions,
      });
    });
  });

  describe('getAssessmentAnswers', () => {
    it('should return formatted assessment answers with stats', async () => {
      const mockAnswers = [
        {
          questionId: 1,
          userAnswer: 'A',
          correctAnswer: 'A',
          question: 'Test Question?',
          optionA: 'Option A',
          optionB: 'Option B',
          optionC: 'Option C',
          optionD: 'Option D',
        },
      ];

      mockDb.where.mockResolvedValueOnce(mockAnswers);

      const result = await service.getAssessmentAnswers(1, 1);

      expect(result.success).toBe(true);
      expect(result.stats).toEqual({
        totalQuestions: 1,
        correctAnswers: 1,
      });
      expect(result.data[0].isCorrect).toBe(true);
    });
  });

  describe('submitAssessmentAnswers', () => {
    it('should submit assessment answers successfully', async () => {
      const answers = [{ questionId: 1, answer: 'A' }];
      mockDb.$returningId.mockResolvedValueOnce(1);

      const result = await service.submitAssessmentAnswers(1, 1, answers);

      expect(result).toEqual({
        success: true,
        message: 'Answers submitted successfully',
      });
      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalled();
    });
  });

  describe('getSessionQueriesWithResponses', () => {
    it('should return queries with their responses', async () => {
      const mockQueries = [
        {
          queryId: 1,
          message: 'Test query message',
          anonymous: '0',
          anonymousName: null,
          likesCount: 0,
          dislikesCount: 0,
          createdDate: new Date('2024-01-01'),
        },
      ];
      const mockResponses = [
        {
          responseId: 1,
          queriesId: 1,
          response: 'Test response',
          regId: 1,
          createdDate: new Date('2024-01-01'),
        },
      ];

      mockDb.where
        .mockResolvedValueOnce(mockQueries)
        .mockResolvedValueOnce(mockResponses);

      const result = await service.getSessionQueriesWithResponses(1);

      expect(result.success).toBe(true);
      expect(result.data[0]).toHaveProperty('responses');
      expect(result.data[0].responses).toHaveLength(1);
    });
  });

  describe('createQuery', () => {
    it('should create a new query successfully', async () => {
      const dto: any = {
        programId: 1,
        batchId: 1,
        moduleId: 1,
        sessionId: 1,
        anonymous: '0',
        anonymousName: null,
        message: 'Test query',
        messagedetail: 'Test detail',
      };

      const regId = '1';

      mockDb.$returningId.mockResolvedValueOnce(1);

      const result = await service.createQuery(dto, regId);

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject(dto);
      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalled();
    });
  });

  describe('createQueryResponse', () => {
    it('should create a new query response successfully', async () => {
      const dto = {
        queriesId: 1,
        response: 'Test response',
      };

      const regId = '1';
      mockDb.$returningId.mockResolvedValueOnce(1);

      const result = await service.createQueryResponse(dto, regId);

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject(dto);
      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalled();
    });
  });
});
