import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  const mockUsersService = {
    createUser: jest.fn(),
    getUsers: jest.fn(),
    getAllUsers: jest.fn(), // Added common method name variation
    getUserById: jest.fn(),
    findByEmail: jest.fn(), // Added common method
    findByName: jest.fn(), // Added common method
    updateUser: jest.fn(), // Added common method
    deleteUser: jest.fn(), // Added common method
    saveRefreshToken: jest.fn(), // Added if needed for auth integration
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
    service = module.get<UsersService>(
      UsersService,
    ) as jest.Mocked<UsersService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = {
        fname: 'John',
        lname: 'doe',
        age: 25,
        password: '12345',
      };
      const expected = { regId: 1, ...dto }; // Changed from 'id' to 'regId' to match your user schema

      mockUsersService.createUser.mockResolvedValue(expected);

      const result = await controller.createUser(dto);

      expect(result).toEqual(expected);
      // Fixed: Pass the entire dto object instead of individual parameters
      expect(mockUsersService.createUser).toHaveBeenCalledWith(dto);
    });

    it('should handle service errors', async () => {
      const dto: CreateUserDto = {
        fname: 'John',
        lname: 'doe',
        age: 25,
        password: '12345',
      };

      const error = new Error('Database connection failed');
      mockUsersService.createUser.mockRejectedValue(error);

      await expect(controller.createUser(dto)).rejects.toThrow(error);
      expect(mockUsersService.createUser).toHaveBeenCalledWith(dto);
    });
  });
});
