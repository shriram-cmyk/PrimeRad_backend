import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { users } from '../db/schema/users';
import { eq } from 'drizzle-orm';

describe('UsersService', () => {
  let service: UsersService;

  const mockDb = {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn(),
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: 'DB', useValue: mockDb }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should call db.insert with correct values', async () => {
      mockDb.values.mockResolvedValueOnce({ id: 1, name: 'John' });

      const result = await service.createUser('John', 25, 'secret');
      expect(mockDb.insert).toHaveBeenCalledWith(users);
      expect(mockDb.values).toHaveBeenCalledWith({
        name: 'John',
        age: 25,
        password: 'secret',
      });
      expect(result).toEqual({ id: 1, name: 'John' });
    });
  });

  describe('getUsers', () => {
    it('should return list of users', async () => {
      const usersList = [
        { id: 1, name: 'John', age: 25 },
        { id: 2, name: 'Jane', age: 30 },
      ];
      mockDb.select.mockReturnThis();
      mockDb.from.mockResolvedValueOnce(usersList);

      const result = await service.getUsers();
      expect(result).toEqual(usersList);
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalledWith(users);
    });
  });

  describe('getUserById', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, name: 'John', age: 25 };
      mockDb.where.mockResolvedValueOnce([user]);

      const result = await service.getUserById(1);
      expect(result).toEqual(user);
      expect(mockDb.where).toHaveBeenCalledWith(eq(users.id, 1));
    });

    it('should return null if not found', async () => {
      mockDb.where.mockResolvedValueOnce([]);

      const result = await service.getUserById(99);
      expect(result).toBeNull();
    });
  });

  describe('findByName', () => {
    it('should return a user if found by name', async () => {
      const user = { id: 1, name: 'John', age: 25 };
      mockDb.where.mockResolvedValueOnce([user]);

      const result = await service.findByName('John');
      expect(result).toEqual(user);
      expect(mockDb.where).toHaveBeenCalledWith(eq(users.name, 'John'));
    });

    it('should return null if not found', async () => {
      mockDb.where.mockResolvedValueOnce([]);

      const result = await service.findByName('DoesNotExist');
      expect(result).toBeNull();
    });
  });

  describe('saveRefreshToken', () => {
    it('should update refresh token for a user', async () => {
      mockDb.where.mockResolvedValueOnce({ affectedRows: 1 });

      const result = await service.saveRefreshToken(1, 'refresh-token');
      expect(result).toEqual({ affectedRows: 1 });
      expect(mockDb.update).toHaveBeenCalledWith(users);
      expect(mockDb.set).toHaveBeenCalledWith({
        refreshToken: 'refresh-token',
      });
      expect(mockDb.where).toHaveBeenCalledWith(eq(users.id, 1));
    });
  });
});
