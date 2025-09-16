import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    createUser: jest.fn(),
    getUsers: jest.fn(),
    getUserById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = { name: 'John', age: 25, password: '12345' };
      const expected = { id: 1, ...dto };

      mockUsersService.createUser.mockResolvedValue(expected);

      const result = await controller.createUser(dto);

      expect(result).toEqual(expected);
      expect(mockUsersService.createUser).toHaveBeenCalledWith(
        dto.name,
        dto.age,
        dto.password,
      );
    });
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const expected = [
        { id: 1, name: 'John', age: 25 },
        { id: 2, name: 'Jane', age: 30 },
      ];
      mockUsersService.getUsers.mockResolvedValue(expected);

      const result = await controller.getUsers();

      expect(result).toEqual(expected);
      expect(mockUsersService.getUsers).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      const expected = { id: 1, name: 'John', age: 25 };
      mockUsersService.getUserById.mockResolvedValue(expected);

      const result = await controller.getUserById(1);

      expect(result).toEqual(expected);
      expect(mockUsersService.getUserById).toHaveBeenCalledWith(1);
    });
  });
});
