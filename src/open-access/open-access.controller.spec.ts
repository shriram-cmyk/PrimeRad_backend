import { Test, TestingModule } from '@nestjs/testing';
import { OpenAccessController } from './open-access.controller';
import { OpenAccessService } from './open-access.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('OpenAccessController', () => {
  let controller: OpenAccessController;
  let service: OpenAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenAccessController],
      providers: [
        {
          provide: OpenAccessService,
          useValue: {
            getOpenAccessItems: jest.fn(),
            getPolls: jest.fn(),
            submitPoll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OpenAccessController>(OpenAccessController);
    service = module.get<OpenAccessService>(OpenAccessService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // describe('getOpenAccessItems', () => {
  //   it('should call service and return items', async () => {
  //     const mockResult = {
  //       success: true,
  //       items: [{ id: 1, name: 'Test Session', type: 'session' }],
  //     };
  //     (service.getOpenAccessItems as jest.Mock).mockResolvedValue(mockResult);

  //     const mockReq = { user: { reg_id: 123 } };
  //     const result = await controller.getOpenAccessItems(
  //       mockReq as any,
  //       'Video',
  //     );

  //     expect(service.getOpenAccessItems).toHaveBeenCalledWith(123, 'Video');
  //     expect(result).toEqual(mockResult);
  //   });

  //   it('should throw UnauthorizedException if no user', async () => {
  //     const mockReq = { user: null };
  //     await expect(
  //       controller.getOpenAccessItems(mockReq as any, 'Video'),
  //     ).rejects.toThrow(UnauthorizedException);
  //   });
  // });

  // describe('getPolls', () => {
  //   it('should call service and return polls', async () => {
  //     const mockPolls = {
  //       success: true,
  //       polls: [
  //         {
  //           id: 1,
  //           question: 'Test Poll?',
  //           options: [{ optionId: 1, optionText: 'Yes', votes: 0 }],
  //           userStatus: '0',
  //         },
  //       ],
  //     };
  //     (service.getPolls as jest.Mock).mockResolvedValue(mockPolls);

  //     const mockReq = { user: { reg_id: 123 } };
  //     const result = await controller.getPolls(mockReq as any, 1);

  //     expect(service.getPolls).toHaveBeenCalledWith(1);
  //     expect(result).toEqual(mockPolls);
  //   });

  //   it('should throw UnauthorizedException if no user', async () => {
  //     const mockReq = { user: null };
  //     await expect(controller.getPolls(mockReq as any, 1)).rejects.toThrow(
  //       UnauthorizedException,
  //     );
  //   });
  // });

  describe('submitPoll', () => {
    it('should call service and return success', async () => {
      const mockReq = { user: { reg_id: 123 } };
      const body = { pollId: 1, optionId: 1 };
      const mockResponse = {
        success: true,
        message: 'Poll submitted successfully',
      };
      (service.submitPoll as jest.Mock).mockResolvedValue(mockResponse);

      const result = await controller.submitPoll(mockReq as any, body);

      expect(service.submitPoll).toHaveBeenCalledWith(123, 1, 1);
      expect(result).toEqual(mockResponse);
    });

    it('should throw ConflictException if user already voted', async () => {
      const mockReq = { user: { reg_id: 123 } };
      const body = { pollId: 1, optionId: 1 };
      (service.submitPoll as jest.Mock).mockRejectedValue(
        new ConflictException('User has already submitted this poll'),
      );

      await expect(controller.submitPoll(mockReq as any, body)).rejects.toThrow(
        ConflictException,
      );
      expect(service.submitPoll).toHaveBeenCalledWith(123, 1, 1);
    });

    it('should throw UnauthorizedException if no user', async () => {
      const mockReq = { user: null };
      const body = { pollId: 1, optionId: 1 };

      await expect(controller.submitPoll(mockReq as any, body)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
