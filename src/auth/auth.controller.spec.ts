import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoggerService } from '../logger/logger.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
  };

  const mockUsersService = {};
  const mockLoggerService = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  const mockResponse = () => {
    const res: any = {};
    res.cookie = jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login user and set cookies', async () => {
      const mockReq = { user: { fname: 'Moses', lname: 'Sharma', regId: 1 } };
      const mockRes = mockResponse();

      mockAuthService.login.mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        name: 'Moses Sharma',
        email: 'moses.sharma@gmail.com',
        role: 'admin',
        designation: 'Consultant',
      });

      await controller.login(
        {
          email: '',
          password: '',
        },
        mockReq,
        mockRes,
      );

      expect(authService.login).toHaveBeenCalledWith(mockReq.user);
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'accessToken',
        'access-token',
        expect.any(Object),
      );
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh-token',
        expect.any(Object),
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Logged in successfully',
        user: expect.any(Object),
      });
    });
  });

  describe('refresh', () => {
    it('should refresh access token if refresh token exists', async () => {
      const mockReq = { cookies: { refreshToken: 'refresh-token' } };
      const mockRes = mockResponse();

      mockAuthService.refresh.mockResolvedValue({
        accessToken: 'new-access-token',
        userId: 1,
      });

      await controller.refresh(mockReq, mockRes);

      expect(authService.refresh).toHaveBeenCalledWith('refresh-token');
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'accessToken',
        'new-access-token',
        expect.any(Object),
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Access token refreshed',
        userId: 1,
      });
    });

    it('should throw if no refresh token in cookies', async () => {
      const mockReq = { cookies: {} };
      const mockRes = mockResponse();

      await expect(controller.refresh(mockReq, mockRes)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('should clear cookies and logout user if refresh token valid', async () => {
      const mockReq = { cookies: { refreshToken: 'valid-refresh-token' } };
      const mockRes = mockResponse();

      // Simulate jwt.verify decoding userId
      jest.spyOn(require('jsonwebtoken'), 'verify').mockReturnValue({ sub: 1 });

      await controller.logout(mockReq, mockRes);

      expect(authService.logout).toHaveBeenCalledWith(1);
      expect(mockRes.clearCookie).toHaveBeenCalledWith(
        'accessToken',
        expect.any(Object),
      );
      expect(mockRes.clearCookie).toHaveBeenCalledWith(
        'refreshToken',
        expect.any(Object),
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Logged out successfully',
      });
    });

    it('should still clear cookies if refresh token invalid', async () => {
      const mockReq = { cookies: { refreshToken: 'invalid-refresh-token' } };
      const mockRes = mockResponse();

      jest.spyOn(require('jsonwebtoken'), 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await controller.logout(mockReq, mockRes);

      expect(authService.logout).not.toHaveBeenCalled();
      expect(mockRes.clearCookie).toHaveBeenCalledWith(
        'accessToken',
        expect.any(Object),
      );
      expect(mockRes.clearCookie).toHaveBeenCalledWith(
        'refreshToken',
        expect.any(Object),
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Logged out successfully',
      });
    });
  });
});
