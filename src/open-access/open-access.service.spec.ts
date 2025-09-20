import { Test, TestingModule } from '@nestjs/testing';
import { OpenAccessService } from './open-access.service';
import { ConflictException } from '@nestjs/common';

describe('OpenAccessService', () => {
  let service: OpenAccessService;

  // Mock chainable builder
  const mockDb = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenAccessService, { provide: 'DB', useValue: mockDb }],
    }).compile();

    service = module.get<OpenAccessService>(OpenAccessService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getOpenAccessItems without errors', async () => {
    // Mock the final call that returns a promise
    (mockDb.from as jest.Mock).mockImplementationOnce(() => ({
      where: () =>
        Promise.resolve([{ id: 1, name: 'Test Session', type: 'session' }]),
    }));

    const result = await service.getOpenAccessItems(123, 'Video');
    expect(result.success).toBe(true);
    expect(result.items.length).toBeGreaterThan(0);
  });

  it('should call submitPoll successfully', async () => {
    (mockDb.from as jest.Mock).mockImplementationOnce(() => ({
      where: () => Promise.resolve([]), // no existing vote
    }));
    (mockDb.insert as jest.Mock).mockReturnValueOnce({
      values: () => Promise.resolve({}),
    });
    (mockDb.update as jest.Mock).mockReturnValueOnce({
      set: () => ({ where: () => Promise.resolve({}) }),
    });

    const result = await service.submitPoll(123, 1, 1);
    expect(result.success).toBe(true);
  });

  it('should throw ConflictException if poll already submitted', async () => {
    (mockDb.from as jest.Mock).mockImplementationOnce(() => ({
      where: () => Promise.resolve([{ pollId: 1 }]), // existing vote
    }));

    await expect(service.submitPoll(123, 1, 1)).rejects.toThrow(
      ConflictException,
    );
  });
});
