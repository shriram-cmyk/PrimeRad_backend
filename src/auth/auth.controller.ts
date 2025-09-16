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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

export class LoginDto {
  @ApiProperty({ example: 'John Doe', description: 'The username' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'strongPassword123',
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
  @ApiResponse({ status: 201, description: 'User logged in successfully' })
  @ApiResponse({ status: 404, description: 'Invalid username or password' })
  async login(@Body() loginDto: LoginDto, @Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully',
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto.userId, refreshDto.refreshToken);
  }
}
