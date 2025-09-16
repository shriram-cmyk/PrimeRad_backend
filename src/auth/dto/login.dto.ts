// src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john', description: 'Username' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'secret123', description: 'Password' })
  @IsString()
  @MinLength(6)
  password: string;
}
