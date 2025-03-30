import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { MESSAGES } from '@/constants';
import {
  generateCreateUserDto,
  generatePaginatedResponse,
  generateQueryParams,
  generateUpdateUserDto,
  generateUserWithSensitiveData,
  MOCK_DELETE_RESULT,
  MOCK_ERROR,
} from '@/mocks';
import {
  hashPassword,
  updateEntity,
  paginate,
  handleError,
  getSelectFields,
} from '@/utils';

import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;
  let queryBuilder: jest.Mocked<SelectQueryBuilder<User>>;

  // Create a mock user with sensitive data
  const mockUser = generateUserWithSensitiveData();

  beforeEach(async () => {
    queryBuilder = {
      select: jest.fn(),
      where: jest.fn(),
      andWhere: jest.fn(),
      orderBy: jest.fn(),
      skip: jest.fn(),
      take: jest.fn(),
      getManyAndCount: jest.fn(),
    } as unknown as jest.Mocked<SelectQueryBuilder<User>>;

    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(
      getRepositoryToken(User),
    ) as jest.Mocked<Repository<User>>;
  });

  describe('create', () => {
    const createUserDto = generateCreateUserDto();

    it('should create a new user successfully', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(null);
      (hashPassword as jest.Mock).mockResolvedValue(createUserDto.password);
      repository.create.mockReturnValue(mockUser);
      repository.save.mockResolvedValue(mockUser);

      // Act
      const result = await service.create(createUserDto);

      // Assert
      expect(result).toEqual({ id: mockUser.id });
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(hashPassword).toHaveBeenCalledWith(createUserDto.password);
    });

    it('should throw ConflictException when email exists', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(mockUser);
      jest.mocked(handleError).mockImplementation(() => {
        throw new ConflictException(MESSAGES.EMAIL_ALREADY_EXISTS);
      });

      // Act & Assert
      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      // Arrange
      repository.findOne.mockRejectedValue(MOCK_ERROR);
      jest.mocked(handleError).mockImplementation(() => {
        throw new InternalServerErrorException(MOCK_ERROR);
      });

      // Act & Assert
      await expect(service.create(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    const queryParams = generateQueryParams();

    it('should return paginated users', async () => {
      // Arrange
      const mockPaginatedResponse = generatePaginatedResponse([mockUser]);
      (paginate as jest.Mock).mockResolvedValue(mockPaginatedResponse);
      (getSelectFields as jest.Mock).mockReturnValue(['id', 'name', 'email']);

      // Act
      const result = await service.findAll(queryParams);

      // Assert
      expect(result).toEqual(mockPaginatedResponse);
      expect(repository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on error', async () => {
      // Arrange
      (paginate as jest.Mock).mockRejectedValue(MOCK_ERROR);
      jest.mocked(handleError).mockImplementation(() => {
        throw new InternalServerErrorException(MESSAGES.GET_USERS_FAILED);
      });

      // Act & Assert
      await expect(service.findAll(queryParams)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOneUser', () => {
    it('should find user by id and return full user info', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(mockUser);

      // Act
      const result = await service.findOneUser({
        condition: { id: mockUser.id },
        hasSensitive: false,
      });

      // Assert
      expect(result).toEqual(mockUser);
    });

    it('should find user by email and return public user info', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(mockUser);

      // Act
      const result = await service.findOneUser({
        condition: { id: mockUser.id },
        hasSensitive: true,
      });

      // Assert
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(null);
      jest.mocked(handleError).mockImplementation(() => {
        throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
      });

      // Act & Assert
      await expect(
        service.findOneUser({
          condition: { id: 'non-existent-id' },
          hasSensitive: false,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateUserDto = generateUpdateUserDto();

    it('should update user successfully', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(mockUser);
      (updateEntity as jest.Mock).mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
      });

      // Act
      const result = await service.update(mockUser.id, updateUserDto);

      // Assert
      expect(result).toEqual(expect.objectContaining(updateUserDto));
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.update('non-existent-id', updateUserDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(mockUser);
      repository.delete.mockResolvedValue(MOCK_DELETE_RESULT);

      // Act
      const result = await service.delete(mockUser.id);

      // Assert
      expect(result.affected).toBe(MOCK_DELETE_RESULT.affected);
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.delete('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
