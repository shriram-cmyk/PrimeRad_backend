import { Injectable, Inject } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { users } from '../db/schema/users';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(@Inject('DB') private readonly db: MySql2Database) {}

  async createUser(name: string, age: number, password: string) {
    return this.db.insert(users).values({ name, age, password });
  }

  async getUsers() {
    return this.db.select().from(users);
  }

  async getUserById(id: number) {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0] ?? null;
  }

  async findByName(name: string) {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.name, name));
    return result[0] ?? null;
  }

  async saveRefreshToken(userId: number, refreshToken: string) {
    return this.db
      .update(users)
      .set({ refreshToken })
      .where(eq(users.id, userId));
  }
}
