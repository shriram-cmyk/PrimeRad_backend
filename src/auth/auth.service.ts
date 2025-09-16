import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoggerService } from '../logger/logger.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: LoggerService,
  ) {
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      this.logger.error('JWT secrets are missing in .env');
      throw new Error('JWT secrets are missing in .env');
    }
    this.logger.log('AuthService initialized successfully');
  }

  async validateUser(email: string, password: string) {
    this.logger.log(`Validating user: ${email}`);
    const user = await this.usersService.findByEmail(email);
    console.log(user);
    if (user && user.password === password) {
      const { password, ...result } = user;
      this.logger.log(`User validated successfully: ${email}`);
      return result;
    }
    this.logger.warn(`Failed validation attempt for user: ${email}`);
    return null;
  }

  async login(user: any) {
    this.logger.log(
      `Generating tokens for user: ${user.fname + ' ' + user.lname}`,
    );
    const payload = { username: user.fname, sub: user.regId, role: user.role };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRATION || '15m',
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    });

    await this.usersService.saveRefreshToken(user.regId, refreshToken);

    this.logger.log(
      `User logged in successfully: ${user.fname + ' ' + user.lname}`,
    );

    return {
      accessToken,
      refreshToken,
      name: user.fname + ' ' + user.lname,
      email: user.email,
      role: user.role,
      designation: user.designation,
    };
  }

  async refresh(userId: number, refreshToken: string) {
    this.logger.log(`Refreshing token for userId: ${userId}`);
    const user = await this.usersService.getUserById(userId);

    if (!user || user.refreshToken !== refreshToken) {
      this.logger.warn(`Invalid refresh token attempt for userId: ${userId}`);
      throw new UnauthorizedException('Invalid refresh token');
    }

    try {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
      const newAccessToken = jwt.sign(
        { username: user.fname, sub: user.regId, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRATION || '15m' },
      );
      this.logger.log(`Refresh token successful for userId: ${userId}`);
      return { accessToken: newAccessToken };
    } catch (err) {
      this.logger.error(
        `Refresh token error for userId: ${userId} - ${err.message}`,
      );
      throw new UnauthorizedException('Refresh token expired or invalid');
    }
  }
}
