import { Test, TestingModule } from '@nestjs/testing';
import { FellowshipController } from './fellowship.controller';
import { FellowshipService } from './fellowship.service';

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
    getSessionQueriesWithResponses: jest.fn(),
    createQueryResponse: jest.fn(),
    createQuery: jest.fn(),
    updateSessionStatus: jest.fn(),
    getObservationTitlesBySession: jest.fn(),
    getFacultyObservationsBySession: jest.fn(),
    submitUserObservations: jest.fn(),
    compareObservations: jest.fn(),
    getDicomVideoUrl: jest.fn(),
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
    }).compile();

    controller = module.get<FellowshipController>(FellowshipController);
    service = module.get<FellowshipService>(FellowshipService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDicomVideoUrl', () => {
    it('should return dicomVideoUrl', async () => {
      const mockUrl = 'https://example.com/video.dcm';
      mockFellowshipService.getDicomVideoUrl.mockResolvedValue(mockUrl);

      const result = await controller.getDicomVideoUrl(1);

      expect(service.getDicomVideoUrl).toHaveBeenCalledWith(1);
      expect(result).toEqual({ dicomVideoUrl: mockUrl });
    });
  });

  describe('getMyCapturedPrograms', () => {
    it('should call service with regId', async () => {
      const mockReq = { user: { reg_id: 123 } };
      const mockData = [{ programId: 1, programName: 'Test' }];
      mockFellowshipService.getCapturedProgramsByUser.mockResolvedValue(
        mockData,
      );

      const result = await controller.getMyCapturedPrograms(mockReq);

      expect(service.getCapturedProgramsByUser).toHaveBeenCalledWith(123);
      expect(result).toEqual(mockData);
    });
  });

  describe('getPhasesAndModules', () => {
    it('should call service with regId, programId, batchId', async () => {
      const mockReq = {
        user: { reg_id: 123 },
        query: { program_id: 1, batch_id: 2 },
      };
      const mockResult = { phases: [] };
      mockFellowshipService.getProgramDetailsByUser.mockResolvedValue(
        mockResult,
      );

      const result = await controller.getPhasesAndModules(mockReq);

      expect(service.getProgramDetailsByUser).toHaveBeenCalledWith(123, 1, 2);
      expect(result).toEqual(mockResult);
    });
  });

  // describe('getSessionsByModule', () => {
  //   it('should call service with module params', async () => {
  //     const mockReq = {
  //       query: { programId: 1, batchId: 2, phaseId: 3, moduleId: 4 },
  //     };
  //     const mockResult = { sessions: [] };
  //     mockFellowshipService.getSessionsByModule.mockResolvedValue(mockResult);

  //     const result = await controller.getSessionsByModule(mockReq);

  //     expect(service.getSessionsByModule).toHaveBeenCalledWith(1, 2, 3, 4);
  //     expect(result).toEqual(mockResult);
  //   });
  // });

  describe('getAllSessions', () => {
    it('should call service with pagination', async () => {
      const mockReq = { query: { page: 2, limit: 5 } };
      const mockResult = { data: [] };
      mockFellowshipService.getAllSessions.mockResolvedValue(mockResult);

      const result = await controller.getAllSessions(mockReq);

      expect(service.getAllSessions).toHaveBeenCalledWith(2, 5);
      expect(result).toEqual(mockResult);
    });
  });
});
