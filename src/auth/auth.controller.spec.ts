import { Test, TestingModule } from '@nestjs/testing';
import { AuthController, LoginDto, RefreshDto } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
      refresh: jest.fn(),
    } as any;

    usersService = {} as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should return tokens when login is successful', async () => {
      const loginDto: LoginDto = {
        name: 'testuser',
        password: 'password123',
      };

      const mockUser = { id: 1, name: 'testuser', role: 'user' };
      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        name: 'testuser',
        role: 'user',
      };

      authService.login.mockResolvedValue(mockTokens);

      const result = await authController.login(loginDto, { user: mockUser });

      expect(result).toEqual(mockTokens);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('refresh', () => {
    it('should return new access token when refresh is valid', async () => {
      const refreshDto: RefreshDto = {
        userId: 1,
        refreshToken: 'valid-refresh-token',
      };

      const mockNewToken = { accessToken: 'new-access-token' };

      authService.refresh.mockResolvedValue(mockNewToken);

      const result = await authController.refresh(refreshDto);

      expect(result).toEqual(mockNewToken);
      expect(authService.refresh).toHaveBeenCalledWith(
        1,
        'valid-refresh-token',
      );
    });

    it('should throw error when refresh fails', async () => {
      const refreshDto: RefreshDto = {
        userId: 1,
        refreshToken: 'invalid-token',
      };

      authService.refresh.mockRejectedValue(new Error('Invalid token'));

      await expect(authController.refresh(refreshDto)).rejects.toThrow(
        'Invalid token',
      );
    });
  });
});
