import { Test, TestingModule } from '@nestjs/testing';
import { FellowshipController } from './fellowship.controller';
import { FellowshipService } from './fellowship.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

describe('FellowshipController', () => {
  let controller: FellowshipController;
  let service: FellowshipService;

  const mockFellowshipService = {
    getCapturedProgramsByUser: jest.fn(),
    getProgramDetailsByUser: jest.fn(),
    getSessionsByModule: jest.fn(),
    getAllSessions: jest.fn(),
    getSessionDetails: jest.fn(),
    getAssessmentQuestions: jest.fn(),
    getAssessmentAnswers: jest.fn(),
    submitAssessmentAnswers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FellowshipController],
      providers: [
        {
          provide: FellowshipService,
          useValue: mockFellowshipService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) // 👈 we mock guards so they don’t block tests
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<FellowshipController>(FellowshipController);
    service = module.get<FellowshipService>(FellowshipService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMyCapturedPrograms', () => {
    it('should return captured programs for the user', async () => {
      const mockReq = { user: { reg_id: 1 } };
      const mockResponse = { success: true, data: [] };

      mockFellowshipService.getCapturedProgramsByUser.mockResolvedValue(
        mockResponse,
      );

      const result = await controller.getMyCapturedPrograms(mockReq);
      expect(result).toEqual(mockResponse);
      expect(service.getCapturedProgramsByUser).toHaveBeenCalledWith(1);
    });
  });

  describe('getPhasesAndModules', () => {
    it('should return program details for the user', async () => {
      const mockReq = {
        user: { reg_id: 1 },
        query: { program_id: 2, batch_id: 3 },
      };
      const mockResponse = { success: true, phases: [] };

      mockFellowshipService.getProgramDetailsByUser.mockResolvedValue(
        mockResponse,
      );

      const result = await controller.getPhasesAndModules(mockReq);
      expect(result).toEqual(mockResponse);
      expect(service.getProgramDetailsByUser).toHaveBeenCalledWith(1, 2, 3);
    });
  });

  describe('getSessionsByModule', () => {
    it('should return grouped sessions', async () => {
      const mockReq = {
        query: { programId: 1, batchId: 2, phaseId: 3, moduleId: 4 },
      };
      const mockResponse = { success: true, sessions: {} };

      mockFellowshipService.getSessionsByModule.mockResolvedValue(mockResponse);

      const result = await controller.getSessionsByModule(mockReq);
      expect(result).toEqual(mockResponse);
      expect(service.getSessionsByModule).toHaveBeenCalledWith(1, 2, 3, 4);
    });
  });

  describe('getAllSessions', () => {
    it('should return paginated sessions', async () => {
      const mockReq = { query: { page: 1, limit: 10 } };
      const mockResponse = { success: true, data: [] };

      mockFellowshipService.getAllSessions.mockResolvedValue(mockResponse);

      const result = await controller.getAllSessions(mockReq);
      expect(result).toEqual(mockResponse);
      expect(service.getAllSessions).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('getSessionDetails', () => {
    it('should return session details', async () => {
      const mockReq = { params: { sessionId: '101' } };
      const mockResponse = { success: true, data: {} };

      mockFellowshipService.getSessionDetails.mockResolvedValue(mockResponse);

      const result = await controller.getSessionDetails(mockReq);
      expect(result).toEqual(mockResponse);
      expect(service.getSessionDetails).toHaveBeenCalledWith(101);
    });
  });

  describe('getAssessmentQuestions', () => {
    it('should return assessment questions', async () => {
      const mockReq = { params: { sessionId: '101' } };
      const mockResponse = { success: true, data: [] };

      mockFellowshipService.getAssessmentQuestions.mockResolvedValue(
        mockResponse,
      );

      const result = await controller.getAssessmentQuestions(mockReq);
      expect(result).toEqual(mockResponse);
      expect(service.getAssessmentQuestions).toHaveBeenCalledWith(101);
    });
  });

  // describe('getAssessmentAnswers', () => {
  //   it('should return user answers', async () => {
  //     const mockReq = { params: { sessionId: '101' } };
  //     const mockResponse = { success: true, data: [] };

  //     mockFellowshipService.getAssessmentAnswers.mockResolvedValue(
  //       mockResponse,
  //     );

  //     const result = await controller.getAssessmentAnswers(mockReq);
  //     expect(result).toEqual(mockResponse);
  //     expect(service.getAssessmentAnswers).toHaveBeenCalledWith(101, 5);
  //   });
  // });

  // describe('submitAssessmentAnswers', () => {
  //   it('should submit answers successfully', async () => {
  //     const mockReq = { params: { sessionId: '101', regId: '5' } };
  //     const body = { answers: [{ questionId: 1, answer: 'B' }] };
  //     const mockResponse = {
  //       success: true,
  //       message: 'Answers submitted successfully',
  //     };

  //     mockFellowshipService.submitAssessmentAnswers.mockResolvedValue(
  //       mockResponse,
  //     );

  //     const result = await controller.submitAssessmentAnswers(mockReq, body);
  //     expect(result).toEqual(mockResponse);
  //     expect(service.submitAssessmentAnswers).toHaveBeenCalledWith(
  //       101,
  //       5,
  //       body.answers,
  //     );
  //   });
  // });
});
