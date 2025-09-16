import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoggerService } from '../logger/logger.service';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let logger: jest.Mocked<LoggerService>;

  const mockUser = {
    id: 1,
    name: 'testuser',
    age: 25,
    password: 'password123',
    role: 'user',
    refreshToken: 'valid-refresh-token',
  };

  beforeEach(async () => {
    usersService = {
      findByName: jest.fn(),
      getUserById: jest.fn(),
      saveRefreshToken: jest.fn(),
    } as any;

    logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    } as any;

    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    process.env.JWT_EXPIRATION = '15m';
    process.env.JWT_REFRESH_EXPIRATION = '7d';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: LoggerService, useValue: logger },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return user without password if valid', async () => {
      usersService.findByName.mockResolvedValue(mockUser);

      const result = await authService.validateUser('testuser', 'password123');

      expect(result).toEqual({
        id: 1,
        name: 'testuser',
        age: 25,
        role: 'user',
        refreshToken: 'valid-refresh-token',
      });
      expect(logger.log).toHaveBeenCalledWith(
        'User validated successfully: testuser',
      );
    });

    it('should return null if user not found', async () => {
      usersService.findByName.mockResolvedValue(null as any);

      const result = await authService.validateUser('wrong', 'pass');

      expect(result).toBeNull();
      expect(logger.warn).toHaveBeenCalledWith(
        'Failed validation attempt for user: wrong',
      );
    });

    it('should return null if password mismatch', async () => {
      usersService.findByName.mockResolvedValue(mockUser);

      const result = await authService.validateUser('testuser', 'wrongpass');

      expect(result).toBeNull();
      expect(logger.warn).toHaveBeenCalledWith(
        'Failed validation attempt for user: testuser',
      );
    });
  });

  describe('login', () => {
    it('should return access and refresh tokens', async () => {
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      usersService.saveRefreshToken.mockResolvedValue(null as any);

      const result = await authService.login(mockUser);

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        name: 'testuser',
        role: 'user',
      });

      expect(usersService.saveRefreshToken).toHaveBeenCalledWith(
        1,
        'refresh-token',
      );
      expect(logger.log).toHaveBeenCalledWith(
        'User logged in successfully: testuser',
      );
    });
  });

  describe('refresh', () => {
    it('should return a new access token if refresh token is valid', async () => {
      usersService.getUserById.mockResolvedValue(mockUser);
      (jwt.verify as jest.Mock).mockReturnValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('new-access-token');

      const result = await authService.refresh(1, 'valid-refresh-token');

      expect(result).toEqual({ accessToken: 'new-access-token' });
      expect(logger.log).toHaveBeenCalledWith(
        'Refresh token successful for userId: 1',
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      usersService.getUserById.mockResolvedValue(null as any); // ✅ allow null

      await expect(authService.refresh(99, 'some-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token invalid', async () => {
      usersService.getUserById.mockResolvedValue(mockUser);
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('invalid token');
      });

      await expect(
        authService.refresh(1, 'invalid-refresh-token'),
      ).rejects.toThrow(UnauthorizedException);

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Refresh token error for userId: 1'),
      );
    });
  });
});
