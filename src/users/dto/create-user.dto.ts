import {
  IsString,
  IsInt,
  Min,
  Length,
  IsOptional,
  IsEmail,
  IsIn,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Mr.', description: 'Salutation' })
  @IsOptional()
  @IsString()
  salutation?: string | null;

  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString()
  @Length(1, 50)
  fname: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  @Length(1, 50)
  lname: string;

  @ApiProperty({ example: 'test@example.com', description: 'Email address' })
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiProperty({ example: '1234567890', description: 'Mobile number' })
  @IsOptional()
  @IsString()
  mobile?: string | null;

  @ApiProperty({ example: 'Developer', description: 'Designation' })
  @IsOptional()
  @IsString()
  designation?: string | null;

  @ApiProperty({ example: 'strongPassword123', description: 'User password' })
  @IsString()
  @Length(6, 100)
  password: string;

  @ApiProperty({ example: null, description: 'Profile picture URL or path' })
  @IsOptional()
  @IsString()
  profilePicture?: string | null;

  @ApiProperty({ example: '1', description: 'Mobile verified: "0" or "1"' })
  @IsOptional()
  @IsIn(['0', '1'])
  mobileVerified?: '0' | '1';

  @ApiProperty({ example: 'user', description: 'User role' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ example: 25, description: 'User age' })
  @IsInt()
  @IsOptional()
  @Min(0)
  age: number;

  @ApiProperty({ example: 'active', description: 'User status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: null, description: 'Address' })
  @IsOptional()
  @IsString()
  address?: string | null;

  @ApiProperty({ example: null, description: 'City' })
  @IsOptional()
  @IsString()
  city?: string | null;

  @ApiProperty({ example: null, description: 'State' })
  @IsOptional()
  @IsString()
  state?: string | null;

  @ApiProperty({ example: null, description: 'Country' })
  @IsOptional()
  @IsString()
  country?: string | null;

  @ApiProperty({ example: null, description: 'Zip code' })
  @IsOptional()
  @IsString()
  zipCode?: string | null;

  @ApiProperty({ example: '', description: 'Institution' })
  @IsOptional()
  @IsString()
  institution?: string;

  @ApiProperty({ example: '', description: 'Medical board' })
  @IsOptional()
  @IsString()
  medboard?: string;

  @ApiProperty({ example: '', description: 'Medical number' })
  @IsOptional()
  @IsString()
  mednumber?: string;

  @ApiProperty({ example: '', description: 'GSTIN' })
  @IsOptional()
  @IsString()
  gstin?: string;

  @ApiProperty({ example: '', description: 'GST entity name' })
  @IsOptional()
  @IsString()
  gstEntityName?: string;

  @ApiProperty({ example: '', description: 'Reference code' })
  @IsOptional()
  @IsString()
  refCode?: string;

  @ApiProperty({ example: '', description: 'First registration' })
  @IsOptional()
  @IsString()
  firstRegistration?: string;

  @ApiProperty({ example: 0, description: 'Batch ID' })
  @IsOptional()
  @IsInt()
  batchId?: number;

  @ApiProperty({ example: '0', description: 'Email verified: "0" or "1"' })
  @IsOptional()
  @IsIn(['0', '1'])
  emailVerified?: '0' | '1';

  @ApiProperty({ example: '0', description: 'GST check: "0" or "1"' })
  @IsOptional()
  @IsIn(['0', '1'])
  gstCheck?: '0' | '1';

  @ApiProperty({ example: '0', description: 'Complete flag: "0" or "1"' })
  @IsOptional()
  @IsIn(['0', '1'])
  complete?: '0' | '1';

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Created date',
  })
  @IsOptional()
  @IsDateString()
  createdDate?: string;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Updated date',
  })
  @IsOptional()
  @IsDateString()
  updatedDate?: string;

  @ApiProperty({ example: null, description: 'Last login' })
  @IsOptional()
  @IsDateString()
  lastLogin?: string | null;

  @ApiProperty({ example: 0, description: 'Login attempts' })
  @IsOptional()
  @IsInt()
  loginAttempts?: number;

  @ApiProperty({ example: '0', description: 'Is deleted: "0" or "1"' })
  @IsOptional()
  @IsIn(['0', '1'])
  isDeleted?: '0' | '1';

  @ApiProperty({ example: 'valid-refresh-token', description: 'Refresh token' })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
