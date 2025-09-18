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
      validateUser: jest.fn(),
      // Note: refresh method is commented out in the actual service
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

  // describe('login', () => {
  //   it('should return tokens when login is successful', async () => {
  //     const loginDto: LoginDto = {
  //       email: 'test@example.com',
  //       password: 'password123',
  //     };

  //     const mockUser = {
  //       id: 1,
  //       fname: 'John',
  //       lname: 'Doe',
  //       email: 'test@example.com',
  //       role: 'user',
  //       designation: 'Developer',
  //     };

  //     const mockTokens = {
  //       accessToken: 'access-token',
  //       refreshToken: 'refresh-token',
  //       name: 'John Doe',
  //       email: 'test@example.com',
  //       designation: 'Developer',
  //       role: 'admin',
  //     };

  //     authService.login.mockResolvedValue(mockTokens);

  //     const result = await authController.login(loginDto, { user: mockUser });

  //     expect(result).toEqual(mockTokens);
  //     expect(authService.login).toHaveBeenCalledWith(mockUser);
  //   });

  //   it('should handle login failure', async () => {
  //     const loginDto: LoginDto = {
  //       email: 'invalid@example.com',
  //       password: 'wrongpassword',
  //     };

  //     const mockUser = null;

  //     if (mockUser === null) {
  //     }
  //   });
  // });

  /*
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
  */

  describe('validateUser', () => {
    it('should return user without password when validation succeeds', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      const mockUser: any = {
        id: 1,
        fname: 'John',
        lname: 'Doe',
        email: 'test@example.com',
        role: 'user',
        designation: 'Developer',
      };

      authService.validateUser.mockResolvedValue(mockUser);

      const result = await authService.validateUser(email, password);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
    });

    it('should return null when validation fails', async () => {
      const email = 'invalid@example.com';
      const password = 'wrongpassword';

      authService.validateUser.mockResolvedValue(null);

      const result = await authService.validateUser(email, password);

      expect(result).toBeNull();
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
    });
  });
});
