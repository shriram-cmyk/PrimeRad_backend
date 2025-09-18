import {
  Controller,
  Post,
  Request,
  Body,
  UnauthorizedException,
  UseGuards,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoggerService } from '../logger/logger.service';
import * as jwt from 'jsonwebtoken';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

export class LoginDto {
  @ApiProperty({ example: 'moses.sharma@gmail.com', description: 'email' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'vidocto@123',
    description: 'The user password',
  })
  @IsString()
  @Length(6, 100)
  password: string;
}
export class RefreshDto {
  @ApiProperty({ example: 1, description: 'The user ID' })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: 'refreshTokenStringHere',
    description: 'Refresh token',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Login a user and get access & refresh tokens' })
  @ApiOkResponse({
    description: 'Access-token and refresh-tokens are recieved',
    schema: {
      example: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1vc2VzIiwic3ViIjoxLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTc5MzI4MTUsImV4cCI6MTc1NzkzMzcxNX0.gZVsi83C8iEJVYaUpM_CpTsQRR9io0sJLAE5MB0poKg',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1vc2VzIiwic3ViIjoxLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTc5MzI4MTUsImV4cCI6MTc1ODUzNzYxNX0.msDHQW_Cu34ps8ykbdyuvItLjXsClOZ00Da0Pxr92FY',
        name: 'Moses Sharma',
        email: 'moses.sharma@gmail.com',
        role: 'admin',
        designation: 'Consultant',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User logged in successfully' })
  @ApiResponse({ status: 404, description: 'Invalid username or password' })
  async login(
    @Body() loginDto: LoginDto,
    @Request() req: any,
    @Response() res: any,
  ) {
    console.log(req.user);
    const { accessToken, refreshToken, ...userData } =
      await this.authService.login(req.user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: 'Logged in successfully',
      user: userData,
    });
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully',
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@Request() req: any, @Response() res: any) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const { accessToken, userId } =
      await this.authService.refresh(refreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    return res.json({ message: 'Access token refreshed', userId });
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logging out and getting cookies cleared' })
  @ApiResponse({
    status: 200,
    description: 'Logged out successfully',
  })
  @ApiResponse({ status: 401, description: 'Error in Logging out' })
  async logout(@Request() req: any, @Response() res: any) {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      try {
        const payload = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET!,
        ) as jwt.JwtPayload;

        await this.authService.logout(payload.sub as unknown as number);
      } catch (err) {
        this.logger.warn(`Invalid refresh token during logout`);
      }
    }

    res.clearCookie('accessToken', { httpOnly: true, sameSite: 'strict' });
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' });

    return res.json({ message: 'Logged out successfully' });
  }
}
