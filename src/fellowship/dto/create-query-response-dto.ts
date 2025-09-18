import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateQueryResponseDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  queriesId: number;

  @ApiProperty({ example: 'MRI is better for soft tissues.' })
  @IsString()
  response: string;
}
