import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateQueryDto {
  @ApiProperty({ example: 101 })
  @IsInt()
  sessionId: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  regId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  programId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  batchId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  moduleId: number;

  @ApiProperty({
    example: '1',
    description: '1 = Anonymous, 0 = Not Anonymous',
  })
  @IsEnum(['1', '0'])
  anonymous: '1' | '0';

  @ApiProperty({ example: 'Anonymous' })
  @IsString()
  anonymousName: string;

  @ApiProperty({ example: 'What is the difference between MRI and CT scan?' })
  @IsString()
  message: string;

  @ApiProperty({
    example: 'Detailed explanation of the query',
    required: false,
  })
  @IsOptional()
  @IsString()
  messagedetail?: string;
}
