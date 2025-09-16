import {
  Injectable,
  Inject,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { tblRegistration } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@Inject('DB') private readonly db: MySql2Database) {}

  private readonly SALT_ROUNDS = 10;
  private async hashPassword(password: string) {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.password);

    const userToInsert = {
      salutation: createUserDto.salutation ?? '',
      fname: createUserDto.fname,
      lname: createUserDto.lname,
      email: createUserDto.email ?? '',
      mobile: createUserDto.mobile ?? '',
      designation: createUserDto.designation ?? '',
      password: createUserDto.password ?? '',
      profilePicture: createUserDto.profilePicture ?? '',
      mobileVerified: (createUserDto.mobileVerified ?? '0') as '0' | '1',
      emailVerified: '0' as '0' | '1',
      institution: createUserDto.institution ?? '',
      medboard: createUserDto.medboard ?? '',
      mednumber: createUserDto.mednumber ?? '',
      country: createUserDto.country ?? '',
      state: createUserDto.state ?? '',
      city: createUserDto.city ?? '',
      pincode: createUserDto.zipCode ?? '',
      address: createUserDto.address ?? '',
      gstCheck: '0' as '0' | '1',
      gstin: createUserDto.gstin ?? '',
      gstEntityName: createUserDto.gstEntityName ?? '',
      refCode: createUserDto.refCode ?? '',
      firstRegistration: createUserDto.firstRegistration ?? '',
      batchId: 0,
      role: (createUserDto.role as 'admin' | 'faculty' | 'user') ?? 'user',
      complete: '0' as '0' | '1',
      createdDate: new Date(),
      refreshToken: '',
    };

    try {
      const result = await this.db.insert(tblRegistration).values(userToInsert);
      return { message: 'User created successfully', result };
    } catch (error: any) {
      if (error?.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email already exists');
      }
      console.error('Database insertion error:', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  // async getUsers(page: number, limit: number) {
  //   try {
  //     const offset = (page - 1) * limit;

  //     const users = await this.db
  //       .select()
  //       .from(tblRegistration)
  //       .limit(limit)
  //       .offset(offset);

  //     const totalResult = await this.db
  //       .select({ count: sql<number>`count(*)` })
  //       .from(tblRegistration);

  //     const total = Number(totalResult[0].count);

  //     return {
  //       data: users,
  //       meta: {
  //         total,
  //         page,
  //         limit,
  //         totalPages: Math.ceil(total / limit),
  //       },
  //     };
  //   } catch (error) {
  //     console.error('Database fetch error:', error);
  //     throw new InternalServerErrorException('Failed to fetch users');
  //   }
  // }

  async getUserById(regId: number) {
    try {
      const result = await this.db
        .select()
        .from(tblRegistration)
        .where(eq(tblRegistration.regId, regId));

      if (!result[0]) {
        throw new NotFoundException(`User with ID ${regId} not found`);
      }
      return result[0];
    } catch (error) {
      console.error('Database fetch error:', error);
      throw new InternalServerErrorException('Failed to fetch user by ID');
    }
  }

  async findByEmail(email: string) {
    try {
      const result = await this.db
        .select()
        .from(tblRegistration)
        .where(eq(tblRegistration.email, email));

      if (!result[0]) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return result[0];
    } catch (error) {
      console.error('Database fetch error:', error);
      throw new InternalServerErrorException('Failed to fetch user by email');
    }
  }

  async saveRefreshToken(userId: number, refreshToken: string) {
    try {
      await this.db
        .update(tblRegistration)
        .set({ refreshToken })
        .where(eq(tblRegistration.regId, userId));
      return { message: 'Refresh token saved successfully' };
    } catch (error) {
      console.error('Error saving refresh token:', error);
      throw new InternalServerErrorException('Failed to save refresh token');
    }
  }
}
