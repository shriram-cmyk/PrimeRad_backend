// src/auth/dto/refresh-token.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  @IsInt()
  userId: number;

  @ApiProperty({ description: 'Refresh token' })
  @IsString()
  refreshToken: string;
}
