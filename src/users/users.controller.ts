import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

export class UserResponseDto {
  regId: number;
  salutation: string | null;
  fname: string | null;
  lname: string | null;
  email: string | null;
  mobile: string | null;
  designation: string | null;
  profilePicture: string | null;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  lastLoginDate: Date | null;
  failedLoginAttempts: number;
  lockoutTime: Date | null;
  preferences: string | null;
  twoFactorEnabled: boolean;
  language: string | null;
  createdDate: Date | null;
}

export class CreateUserResponseDto {
  message: string;
  user: UserResponseDto;
}

export class ErrorResponseDto {
  statusCode: number;
  message: string;
  error?: string;
}

@ApiTags('Users')
@Controller('users')
// @UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Create a new user',
    description:
      'Creates a new user account. Only accessible by admin or superadmin roles.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User creation data',
  })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: CreateUserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
    type: ErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions - Admin role required',
    type: ErrorResponseDto,
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
  // @Get()
  // // @Roles('admin', 'superadmin', 'user')
  // @ApiOperation({
  //   summary: 'Get all users',
  //   description:
  //     'Retrieves a list of all users. Accessible by all authenticated users.',
  // })
  // @ApiOkResponse({
  //   description: 'Users retrieved successfully',
  //   type: [UserResponseDto],
  // })
  // @ApiUnauthorizedResponse({
  //   description: 'Authentication required',
  //   type: ErrorResponseDto,
  // })
  // @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  // @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  // async getUsers(@Query('page') page = 1, @Query('limit') limit = 10) {
  //   return this.usersService.getUsers(page, limit);
  // }

  // @Get(':id')
  // @Roles('admin', 'superadmin', 'user')
  // @ApiOperation({
  //   summary: 'Get user by ID',
  //   description:
  //     'Retrieves a specific user by their ID. Accessible by all authenticated users.',
  // })
  // @ApiParam({
  //   name: 'id',
  //   type: 'number',
  //   description: 'User ID',
  //   example: 1,
  // })
  // @ApiOkResponse({
  //   description: 'User found and retrieved successfully',
  //   type: UserResponseDto,
  // })
  // @ApiNotFoundResponse({
  //   description: 'User not found',
  //   type: ErrorResponseDto,
  // })
  // @ApiBadRequestResponse({
  //   description: 'Invalid user ID format',
  //   type: ErrorResponseDto,
  // })
  // @ApiUnauthorizedResponse({
  //   description: 'Authentication required',
  //   type: ErrorResponseDto,
  // })
  // async getUserById(@Param('id') id: number) {
  //   return this.usersService.getUserById(Number(id));
  // }

  @Get('email/:email')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Get user by email',
    description:
      'Retrieves a specific user by their email address. Only accessible by admin or superadmin roles.',
  })
  @ApiParam({
    name: 'email',
    type: 'string',
    description: 'User email address',
    example: 'user@example.com',
  })
  @ApiOkResponse({
    description: 'User found and retrieved successfully',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found with the specified email',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid email format',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
    type: ErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions - Admin role required',
    type: ErrorResponseDto,
  })
  async getUserByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }
}
