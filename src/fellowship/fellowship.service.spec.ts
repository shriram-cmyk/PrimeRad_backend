import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FellowshipService } from './fellowship.service';
import { CreateQueryDto } from './dto/create-query-dto';
import { CreateQueryResponseDto } from './dto/create-query-response-dto';

describe('FellowshipService', () => {
  let service: FellowshipService;
  let mockDb: any;

  beforeEach(async () => {
    mockDb = {
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
    };

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

  // describe('getCapturedProgramsByUser', () => {
  //   it('should return paginated programs successfully', async () => {
  //     const mockCountResult = { count: 5 };
  //     const mockPrograms = [
  //       {
  //         programId: 1,
  //         programName: 'Test Program',
  //         programShortname: 'TP',
  //         programUrl: 'test-program',
  //         programTitle: 'Test Program Title',
  //         programDescription: 'Test Description',
  //         programImage: 'test.jpg',
  //         programDuration: 30,
  //         batchId: 1,
  //         batchName: 'Batch 1',
  //         batchStart: new Date(),
  //         batchEnd: new Date(),
  //         enrolledDate: new Date(),
  //         moduleCount: 5,
  //         payStatus: 'captured',
  //       },
  //     ];

  //     mockDb.select.mockReturnValueOnce({
  //       from: jest.fn().mockReturnThis(),
  //       where: jest.fn().mockResolvedValue([mockCountResult]),
  //     });

  //     mockDb.select.mockReturnValueOnce({
  //       from: jest.fn().mockReturnThis(),
  //       leftJoin: jest.fn().mockReturnThis(),
  //       where: jest.fn().mockReturnThis(),
  //       groupBy: jest.fn().mockReturnThis(),
  //       limit: jest.fn().mockReturnThis(),
  //       offset: jest.fn().mockResolvedValue(mockPrograms),
  //     });

  //     const result = await service.getCapturedProgramsByUser(1, 1, 10);

  //     expect(result.success).toBe(true);
  //     expect(result.pagination.total).toBe(5);
  //     expect(result.data).toEqual(mockPrograms);
  //   });

  //   it('should handle errors gracefully', async () => {
  //     mockDb.select.mockReturnValue({
  //       from: jest.fn().mockReturnThis(),
  //       where: jest.fn().mockRejectedValue(new Error('Database error')),
  //     });

  //     await expect(service.getCapturedProgramsByUser(1)).rejects.toThrow(
  //       'Database error',
  //     );
  //   });
  // });

  // describe('getProgramDetailsByUser', () => {
  //   it('should return program details when user has valid payment', async () => {
  //     const mockPayment = { paymentId: 1 };
  //     const mockBatchDetails = {
  //       modulesCount: 5,
  //       videosCount: 10,
  //       dicomCount: 2,
  //       assessmentCount: 3,
  //       certificateCount: 1,
  //       meetingCount: 4,
  //     };
  //     const mockPhases = [
  //       {
  //         phaseId: 1,
  //         phaseName: 'Phase 1',
  //         phaseDescription: 'First phase',
  //         phaseImage: 'phase1.jpg',
  //         phaseStart: new Date(),
  //         phaseEnd: new Date(),
  //       },
  //     ];
  //     const mockModules = [
  //       {
  //         moduleId: 1,
  //         moduleName: 'Module 1',
  //         moduleDescription: 'First module',
  //         moduleImage: 'module1.jpg',
  //         moduleStart: new Date(),
  //         module2Start: new Date(),
  //         module3Start: new Date(),
  //         programType: 'online',
  //       },
  //     ];

  //     mockDb.select.mockReturnValueOnce({
  //       from: jest.fn().mockReturnThis(),
  //       where: jest.fn().mockResolvedValue([mockPayment]),
  //     });

  //     mockDb.select.mockReturnValueOnce({
  //       from: jest.fn().mockReturnThis(),
  //       where: jest.fn().mockResolvedValue([mockBatchDetails]),
  //     });

  //     mockDb.select.mockReturnValueOnce({
  //       from: jest.fn().mockReturnThis(),
  //       where: jest.fn().mockResolvedValue(mockPhases),
  //     });

  //     mockDb.select.mockReturnValueOnce({
  //       from: jest.fn().mockReturnThis(),
  //       where: jest.fn().mockResolvedValue(mockModules),
  //     });

  //     const result: any = await service.getProgramDetailsByUser(1, 1, 1);

  //     expect(result.success).toBe(true);
  //     expect(result.counts).toEqual(mockBatchDetails);
  //     expect(result.phases).toHaveLength(1);
  //     expect(result.phases[0].modules).toEqual(mockModules);
  //   });

  //   it('should return failure when user has not purchased program', async () => {
  //     mockDb.select.mockReturnValue({
  //       from: jest.fn().mockReturnThis(),
  //       where: jest.fn().mockResolvedValue([]),
  //     });

  //     const result = await service.getProgramDetailsByUser(1, 1, 1);

  //     expect(result.success).toBe(false);
  //     expect(result.message).toBe(
  //       'User has not purchased this program or batch.',
  //     );
  //   });
  // });

  describe('getSessionsByModule', () => {
    it('should return sessions with progress', async () => {
      const mockSessions = [
        { sessionId: 1, sessionName: 'Session 1', sessionType: 'Video' },
        { sessionId: 2, sessionName: 'Session 2', sessionType: 'Live' },
      ];
      const mockStatuses = [
        { sessionId: 1, sessionStatus: '2' },
        { sessionId: 2, sessionStatus: '1' },
      ];

      // Mock sessions query
      mockDb.select.mockReturnValueOnce({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockSessions),
      });

      // Mock statuses query
      mockDb.select.mockReturnValueOnce({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockStatuses),
      });

      const result = await service.getSessionsByModule(1, 1, 1, 1);

      expect(result.success).toBe(true);
      expect(result.sessions).toBeDefined();
      expect(result.progress).toBeDefined();
    });
  });

  describe('getAllSessions', () => {
    it('should return paginated sessions', async () => {
      const mockCount = { count: 3 };
      const mockSessions = [
        {
          sessionName: 'Session 1',
          sessionType: 'Video',
          startDate: new Date(),
          endDate: new Date(),
        },
      ];

      // Mock count query
      mockDb.select.mockReturnValueOnce({
        from: jest.fn().mockResolvedValue([mockCount]),
      });

      // Mock sessions query
      mockDb.select.mockReturnValueOnce({
        from: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockResolvedValue(mockSessions),
      });

      const result = await service.getAllSessions(1, 10);

      expect(result.success).toBe(true);
      expect(result.pagination.total).toBe(3);
      expect(result.data).toEqual(mockSessions);
    });
  });

  describe('getSessionDetails', () => {
    it('should return session details for video session', async () => {
      const mockSession = {
        sessionId: 1,
        sessionDuration: 60,
        sessionImage: 'session.jpg',
        sessionName: 'Test Session',
        sessionType: 'Video',
        sessionUrl: 'https://example.com/video',
        isZoom: '0',
        zoomMeetingId: null,
        zoomStartdate: null,
        zoomEnddate: null,
        zoomPassword: null,
        zoomLiveLink: null,
        dicomVideoUrl: null,
        dicomCaseId: null,
      };

      const mockFaculty = [
        {
          facultyId: 1,
          facultyName: 'Dr. Smith',
          facultyType: 'primary',
          facultyImage: 'smith.jpg',
          facultyLocation: 'New York',
          facultyCountry: 'USA',
        },
      ];

      const mockResources = [
        {
          fileType: 'pdf',
          displayName: 'Resource 1',
          linkName: 'resource1.pdf',
          fileName: 'resource1.pdf',
        },
      ];

      const mockNextSessions = [
        {
          sessionName: 'Next Session',
          moduleName: 'Module 2',
          sessionImage: 'next.jpg',
        },
      ];

      mockDb.select.mockReturnValueOnce({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockSession]),
      });

      mockDb.select.mockReturnValueOnce({
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockFaculty),
      });

      mockDb.select.mockReturnValueOnce({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockResources),
      });

      mockDb.select.mockReturnValueOnce({
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockNextSessions),
      });

      const result: any = await service.getSessionDetails(1);

      expect(result.success).toBe(true);
      expect(result.data.currentSession).toBeDefined();
      expect(result.data.faculty).toEqual(mockFaculty);
      expect(result.data.resources).toEqual(mockResources);
      expect(result.data.nextSessions).toEqual(mockNextSessions);
    });

    it('should return failure when session not found', async () => {
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      });

      const result = await service.getSessionDetails(999);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Session not found');
    });
  });

  describe('getAssessmentQuestions', () => {
    it('should return assessment questions', async () => {
      const mockQuestions = [
        {
          assessmentQuestionId: 1,
          assessmentQuestion: 'What is 2+2?',
          assessmentQuestionDescription: 'Simple math',
          answerOptionA: '3',
          answerOptionB: '4',
          answerOptionC: '5',
          answerOptionD: '6',
          questionImage: null,
        },
      ];

      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockQuestions),
      });

      const result = await service.getAssessmentQuestions(1);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockQuestions);
    });
  });

  describe('getAssessmentAnswers', () => {
    it('should return assessment answers with stats', async () => {
      const mockAnswers = [
        {
          questionId: 1,
          userAnswer: 'B',
          correctAnswer: 'B',
          question: 'What is 2+2?',
          optionA: '3',
          optionB: '4',
          optionC: '5',
          optionD: '6',
        },
        {
          questionId: 2,
          userAnswer: 'A',
          correctAnswer: 'B',
          question: 'What is 3+3?',
          optionA: '5',
          optionB: '6',
          optionC: '7',
          optionD: '8',
        },
      ];

      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockAnswers),
      });

      const result = await service.getAssessmentAnswers(1, 1);

      expect(result.success).toBe(true);
      expect(result.stats.totalQuestions).toBe(2);
      expect(result.stats.correctAnswers).toBe(1);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].isCorrect).toBe(true);
      expect(result.data[1].isCorrect).toBe(false);
    });
  });

  describe('submitAssessmentAnswers', () => {
    it('should submit answers successfully', async () => {
      const answers = [
        { questionId: 1, answer: 'B' },
        { questionId: 2, answer: 'A' },
      ];

      mockDb.insert.mockReturnValue({
        values: jest.fn().mockResolvedValue(undefined),
      });

      const result = await service.submitAssessmentAnswers(1, 1, answers);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Answers submitted successfully');
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe('getSessionQueriesWithResponses', () => {
    it('should return queries with responses', async () => {
      const mockQueries = [
        {
          queryId: 1,
          message: 'Test query',
          anonymous: '0',
          anonymousName: null,
          likesCount: 5,
          dislikesCount: 1,
          createdDate: new Date(),
        },
      ];

      const mockResponses = [
        {
          responseId: 1,
          queriesId: 1,
          response: 'Test response',
          regId: 1,
          createdDate: new Date(),
        },
      ];

      mockDb.select.mockReturnValueOnce({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockQueries),
      });

      mockDb.select.mockReturnValueOnce({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockResponses),
      });

      const result = await service.getSessionQueriesWithResponses(1);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].responses).toHaveLength(1);
    });
  });

  describe('createQuery', () => {
    it('should create query successfully', async () => {
      const dto: CreateQueryDto = {
        programId: 1,
        batchId: 1,
        moduleId: 1,
        sessionId: 1,
        anonymous: '0',
        anonymousName: '',
        message: 'Test query',
        messagedetail: 'Test details',
      };

      mockDb.insert.mockReturnValue({
        values: jest.fn().mockReturnThis(),
        $returningId: jest.fn().mockResolvedValue(1),
      });

      const result = await service.createQuery(dto, 1);

      expect(result.success).toBe(true);
      expect(result.data.queriesId).toBe(1);
    });
  });

  describe('createQueryResponse', () => {
    it('should create query response successfully', async () => {
      const dto: CreateQueryResponseDto = {
        queriesId: 1,
        response: 'Test response',
      };

      mockDb.insert.mockReturnValue({
        values: jest.fn().mockReturnThis(),
        $returningId: jest.fn().mockResolvedValue(1),
      });

      const result = await service.createQueryResponse(dto, 1);

      expect(result.success).toBe(true);
      expect(result.data.queryResponseId).toBe(1);
    });
  });

  describe('updateSessionStatus', () => {
    it('should update existing session status', async () => {
      const existingRecord = { sessionStatusId: 1 };

      // Mock select query for existing record
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([existingRecord]),
      });

      // Mock update query
      mockDb.update.mockReturnValue({
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(undefined),
      });

      const result = await service.updateSessionStatus(1, 1, '2');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Session status updated successfully');
    });

    it('should create new session status when none exists', async () => {
      // Mock select query for no existing record
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      });

      // Mock insert query
      mockDb.insert.mockReturnValue({
        values: jest.fn().mockResolvedValue(undefined),
      });

      const result = await service.updateSessionStatus(1, 1, '1');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Session status created successfully');
    });
  });

  describe('getObservationTitlesBySession', () => {
    it('should return observation titles', async () => {
      const mockTitles = [
        {
          observationTitle1: 'Title 1',
          observationTitle2: 'Title 2',
          observationTitle3: 'na',
          observationTitle4: 'na',
          observationTitle5: 'na',
          observationTitle6: 'na',
          observationTitle7: 'na',
          observationTitle8: 'na',
          observationTitle9: 'na',
          observationTitle10: 'na',
        },
      ];

      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockTitles),
      });

      const result = await service.getObservationTitlesBySession(1);

      expect(result).toEqual(mockTitles);
    });
  });

  describe('getFacultyObservationsBySession', () => {
    it('should return faculty observations', async () => {
      const mockRecords = [
        {
          dicomObservationTitlesId: 1,
          facultyObservation: 'Faculty observation text',
          observationTitle1: 'Title 1',
          observationTitle2: 'Title 2',
          observationTitle3: 'na',
          observationTitle4: 'na',
          observationTitle5: 'na',
          observationTitle6: 'na',
          observationTitle7: 'na',
          observationTitle8: 'na',
          observationTitle9: 'na',
          observationTitle10: 'na',
        },
      ];

      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockRecords),
      });

      const result = await service.getFacultyObservationsBySession(1);

      expect(result).toHaveLength(1);
      expect(result[0].titles).toEqual(['Title 1', 'Title 2']);
      expect(result[0].facultyObservation).toBe('Faculty observation text');
    });
  });

  describe('submitUserObservations', () => {
    it('should update existing observation', async () => {
      const dto = {
        obsTitleId: 1,
        userObs: 'User observation',
      };

      const mockTitleExists = [{ obsTitleId: 1 }];
      const mockExistingRecord = [{ userObsId: 1 }];

      // Mock title exists query
      mockDb.select.mockReturnValueOnce({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockTitleExists),
      });

      // Mock existing record query
      mockDb.select.mockReturnValueOnce({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockExistingRecord),
      });

      // Mock update query
      mockDb.update.mockReturnValue({
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(undefined),
      });

      const result = await service.submitUserObservations(dto, 1);

      expect(result.success).toBe(true);
      expect(result.message).toBe('User observations updated successfully');
    });

    it('should create new observation when none exists', async () => {
      const dto = {
        obsTitleId: 1,
        userObs: 'User observation',
      };

      const mockTitleExists = [{ obsTitleId: 1 }];

      // Mock title exists query
      mockDb.select.mockReturnValueOnce({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockTitleExists),
      });

      // Mock no existing record query
      mockDb.select.mockReturnValueOnce({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      });

      // Mock insert query
      mockDb.insert.mockReturnValue({
        values: jest.fn().mockResolvedValue(undefined),
      });

      const result = await service.submitUserObservations(dto, 1);

      expect(result.success).toBe(true);
      expect(result.message).toBe('User observations saved successfully');
    });

    it('should throw error when obsTitleId does not exist', async () => {
      const dto = {
        obsTitleId: 999,
        userObs: 'User observation',
      };

      // Mock title does not exist
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      });

      await expect(service.submitUserObservations(dto, 1)).rejects.toThrow(
        'Failed to save user observations: ObsTitleId 999 does not exist in tblDicomObsTitles',
      );
    });
  });

  describe('compareObservations', () => {
    it('should compare faculty and user observations', async () => {
      const mockFacultyRecords = [
        {
          obsTitleId: 1,
          observationTitle: 'Title 1',
          facultyObservation: 'Faculty observation',
        },
      ];

      const mockUserRecords = [
        {
          obsTitleId: 1,
          userObs: '["User observation 1", "User observation 2"]',
        },
      ];

      // Mock faculty records query
      mockDb.select.mockReturnValueOnce({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockFacultyRecords),
      });

      // Mock user records query
      mockDb.select.mockReturnValueOnce({
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockUserRecords),
      });

      const result = await service.compareObservations(1, 1);

      expect(result.userObservations).toHaveLength(1);
      expect(result.facultyObservations).toHaveLength(1);
      expect(result.userObservations[0].observations).toEqual([
        'User observation 1',
        'User observation 2',
      ]);
    });

    it('should handle invalid JSON in user observations', async () => {
      const mockFacultyRecords = [
        {
          obsTitleId: 1,
          observationTitle: 'Title 1',
          facultyObservation: 'Faculty observation',
        },
      ];

      const mockUserRecords = [
        {
          obsTitleId: 1,
          userObs: 'Invalid JSON',
        },
      ];

      // Mock faculty records query
      mockDb.select.mockReturnValueOnce({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockFacultyRecords),
      });

      // Mock user records query
      mockDb.select.mockReturnValueOnce({
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockUserRecords),
      });

      const result = await service.compareObservations(1, 1);

      expect(result.userObservations[0].observations).toEqual(['Invalid JSON']);
    });
  });

  describe('getDicomVideoUrl', () => {
    it('should return dicom video URL', async () => {
      const mockSession = {
        dicomVideoUrl: 'https://example.com/video.mp4',
      };

      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockSession]),
      });

      const result = await service.getDicomVideoUrl(1);

      expect(result).toBe('https://example.com/video.mp4');
    });

    it('should throw NotFoundException when session not found', async () => {
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      });

      await expect(service.getDicomVideoUrl(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return empty string when dicomVideoUrl is null', async () => {
      const mockSession = {
        dicomVideoUrl: null,
      };

      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockSession]),
      });

      const result = await service.getDicomVideoUrl(1);

      expect(result).toBe('');
    });
  });
});
