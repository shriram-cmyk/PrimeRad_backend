import { IsString, IsInt, Min, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The user name' })
  @IsString()
  @Length(2, 50)
  name: string;

  @ApiProperty({ example: 25, description: 'The user age' })
  @IsInt()
  @Min(0)
  age: number;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'The user password',
  })
  @IsString()
  @Length(6, 100)
  password: string;

  @ApiProperty({
    example: 'user',
    description: 'The role of the user (defaults to "user")',
    required: false,
  })
  @IsOptional()
  @IsString()
  role?: string;
}
