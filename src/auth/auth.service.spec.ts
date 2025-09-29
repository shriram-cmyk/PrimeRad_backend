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

  const mockUser: any = {
    regId: 1,
    salutation: 'Mr.' as string | null,
    fname: 'Test' as string | null,
    lname: 'User' as string | null,
    email: 'testuser@example.com' as string | null,
    mobile: '1234567890' as string | null,
    designation: 'Developer' as string | null,
    password: 'password123' as string | null,
    profilePicture: '' as string | null,
    mobileVerified: '1' as '0' | '1' | null,
    emailVerified: '1' as '0' | '1' | null,
    institution: 'Test Institution' as string | null,
    medboard: 'Test Board' as string | null,
    mednumber: 'MED123' as string | null,
    country: 'India' as string | null,
    state: 'Tamil Nadu' as string | null,
    city: 'Vellore' as string | null,
    pincode: '632014' as string | null,
    address: 'Test Address' as string | null,
    gstCheck: '0' as '0' | '1' | null,
    gstin: '' as string | null,
    gstEntityName: '' as string | null,
    refCode: '' as string | null,
    firstRegistration: '' as string | null,
    batchId: 0 as number | null,
    complete: '1' as '0' | '1' | null,
    createdDate: new Date() as Date | null,
  };

  // Expected user object without password (as returned by validateUser)
  const mockUserWithoutPassword: any = {
    regId: 1,
    salutation: 'Mr.',
    fname: 'Test',
    lname: 'User',
    email: 'testuser@example.com',
    mobile: '1234567890',
    designation: 'Developer',
    profilePicture: '',
    mobileVerified: '1',
    emailVerified: '1',
    institution: 'Test Institution',
    medboard: 'Test Board',
    mednumber: 'MED123',
    country: 'India',
    state: 'Tamil Nadu',
    city: 'Vellore',
    pincode: '632014',
    address: 'Test Address',
    gstCheck: '0',
    gstin: '',
    gstEntityName: '',
    refCode: '',
    firstRegistration: '',
    batchId: 0,
    complete: '1',
    createdDate: expect.any(Date),
  };

  beforeEach(async () => {
    // Mock all the methods that UsersService actually has
    usersService = {
      findByEmail: jest.fn(),
      findByName: jest.fn(),
      getUserById: jest.fn(),
      saveRefreshToken: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      getAllUsers: jest.fn(),
    } as any;

    logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user without password if valid', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      const result = await authService.validateUser(
        'testuser@example.com',
        'password123',
      );

      expect(result).toEqual(mockUserWithoutPassword);
      expect(logger.log).toHaveBeenCalledWith(
        'User validated successfully: testuser@example.com',
      );
    });

    it('should return null if user not found', async () => {
      usersService.findByEmail.mockResolvedValue(null as any);

      const result = await authService.validateUser(
        'wrong@email.com',
        'password123',
      );

      expect(result).toBeNull();
      expect(logger.warn).toHaveBeenCalledWith(
        'Failed validation attempt for user: wrong@email.com',
      );
    });

    it('should return null if password mismatch', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      const result = await authService.validateUser(
        'testuser@example.com',
        'wrongpass',
      );

      expect(result).toBeNull();
      expect(logger.warn).toHaveBeenCalledWith(
        'Failed validation attempt for user: testuser@example.com',
      );
    });
  });

  // describe('login', () => {
  //   it('should return access and refresh tokens along with user name and role', async () => {
  //     (jwt.sign as jest.Mock)
  //       .mockReturnValueOnce('access-token')
  //       .mockReturnValueOnce('refresh-token');

  //     const result = await authService.login(mockUser);

  //     expect(result).toEqual({
  //       accessToken: 'access-token',
  //       refreshToken: 'refresh-token',
  //       name: 'Test User',
  //       role: undefined, // Assuming role is undefined based on the error output
  //       designation: 'Developer',
  //       email: 'testuser@example.com',
  //     });

  //     expect(logger.log).toHaveBeenCalledWith(
  //       'User logged in successfully: Test User',
  //     );
  //   });

  //   it('should generate JWT tokens with correct payload and options', async () => {
  //     (jwt.sign as jest.Mock)
  //       .mockReturnValueOnce('access-token')
  //       .mockReturnValueOnce('refresh-token');

  //     await authService.login(mockUser);

  //     // Access token payload
  //     expect(jwt.sign).toHaveBeenNthCalledWith(
  //       1,
  //       {
  //         username: 'Test',
  //         sub: mockUser.regId,
  //         role: undefined,
  //       },
  //       'test-secret',
  //       { expiresIn: '15m' },
  //     );

  //     // Refresh token payload
  //     expect(jwt.sign).toHaveBeenNthCalledWith(
  //       2,
  //       {
  //         username: 'Test',
  //         sub: mockUser.regId,
  //         role: undefined,
  //       },
  //       'test-refresh-secret',
  //       { expiresIn: '7d' },
  //     );
  //   });
  // });
});
