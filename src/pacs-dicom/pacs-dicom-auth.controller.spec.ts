import { Test, TestingModule } from '@nestjs/testing';
import { PacsAuthController } from './pacs-dicom-auth.controller';
import { PacsAuthService } from './pacs-dicom-auth.service';

describe('PacsAuthController', () => {
  let controller: PacsAuthController;
  let service: PacsAuthService;

  beforeEach(async () => {
    const mockPacsAuthService = {
      getAccessToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PacsAuthController],
      providers: [
        {
          provide: PacsAuthService,
          useValue: mockPacsAuthService,
        },
      ],
    }).compile();

    controller = module.get<PacsAuthController>(PacsAuthController);
    service = module.get<PacsAuthService>(PacsAuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return access token when service succeeds', async () => {
    const fakeToken = 'mocked-access-token';
    jest.spyOn(service, 'getAccessToken').mockResolvedValue(fakeToken);

    const result = await controller.getToken();

    expect(service.getAccessToken).toHaveBeenCalled();
    expect(result).toEqual({ access_token: fakeToken });
  });

  it('should throw error when service fails', async () => {
    jest
      .spyOn(service, 'getAccessToken')
      .mockRejectedValue(new Error('Failed to fetch'));

    await expect(controller.getToken()).rejects.toThrow('Failed to fetch');
  });
});
