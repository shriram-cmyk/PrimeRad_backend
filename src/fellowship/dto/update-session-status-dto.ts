import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class UpdateSessionStatusDto {
  @ApiProperty({
    description: 'Session status',
    enum: ['1', '2'],
    example: '1',
  })
  @IsIn(['1', '2'])
  status: '1' | '2';
}
