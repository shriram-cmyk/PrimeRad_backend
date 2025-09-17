import { Test, TestingModule } from '@nestjs/testing';
import { PacsAuthService } from './pacs-dicom-auth.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PacsAuthService', () => {
  let service: PacsAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PacsAuthService],
    }).compile();

    service = module.get<PacsAuthService>(PacsAuthService);
    jest.clearAllMocks();
  });

  it('should return cached token if not expired', async () => {
    (service as any).accessToken = 'cached-token';
    (service as any).tokenExpiry = Date.now() + 60_000;

    const token = await service.getAccessToken();

    expect(token).toBe('cached-token');
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('should fetch new token if expired', async () => {
    (service as any).accessToken = 'old-token';
    (service as any).tokenExpiry = Date.now() - 1000;

    mockedAxios.post.mockResolvedValueOnce({
      data: { access_token: 'new-token', expires_in: 3600 },
    });

    const token = await service.getAccessToken();

    expect(token).toBe('new-token');
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });
});
