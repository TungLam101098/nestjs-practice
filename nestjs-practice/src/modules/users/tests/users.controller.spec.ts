import { Test, TestingModule } from '@nestjs/testing';

import {
  generateUserResponse,
  generateCreateUserDto,
  generateQueryParams,
  generatePaginatedResponse,
  generateUpdateUserDto,
  MOCK_DELETE_RESULT,
} from '@/mocks';

import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  // Create a mock user
  const mockUser = generateUserResponse();

  // Reset mock service before each test
  beforeEach(async () => {
    const mockUsersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOneUser: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

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

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const createUserDto = generateCreateUserDto();
      const expectedResult = { id: mockUser.id };
      service.create.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.create(createUserDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      // Arrange
      const query = generateQueryParams();
      const expectedResult = generatePaginatedResponse([mockUser]);
      service.findAll.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.findAll(query);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      // Arrange
      const id = mockUser.id;
      service.findOneUser.mockResolvedValue(mockUser);

      // Act
      const result = await controller.findById(id);

      // Assert
      expect(result).toEqual(mockUser);
      expect(service.findOneUser).toHaveBeenCalledWith({
        condition: { id },
        hasSensitive: false,
      });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      // Arrange
      const id = mockUser.id;
      const updateUserDto = generateUpdateUserDto();
      service.update.mockResolvedValue(mockUser);

      // Act
      const result = await controller.update(id, updateUserDto);

      // Assert
      expect(result).toEqual(mockUser);
      expect(service.update).toHaveBeenCalledWith(id, updateUserDto);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      // Arrange
      const id = mockUser.id;
      service.delete.mockResolvedValue(MOCK_DELETE_RESULT);

      // Act
      const result = await controller.delete(id);

      // Assert
      expect(result).toEqual(MOCK_DELETE_RESULT);
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
