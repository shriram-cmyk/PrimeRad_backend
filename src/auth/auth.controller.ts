import {
  Controller,
  Post,
  Request,
  Body,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
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
  async login(@Body() loginDto: LoginDto, @Request() req: any) {
    console.log('inside');
    console.log('user', req.user);
    return this.authService.login(req.user);
  }

  // @Post('refresh')
  // @ApiOperation({ summary: 'Refresh access token using refresh token' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Access token refreshed successfully',
  // })
  // @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  // async refresh(@Body() refreshDto: RefreshDto) {
  //   return this.authService.refresh(refreshDto.userId, refreshDto.refreshToken);
  // }
}
