import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MESSAGES } from '@/constants';
import { PaginationResponse } from '@/interfaces';
import {
  applyFilters,
  applySort,
  getSelectFields,
  handleError,
  hashPassword,
  isPasswordValid,
  paginate,
  updateEntity,
} from '@/utils';

import { USER_SELECT_FIELDS } from './configs/select-fields.config';
import { CreateUserDto } from './dtos/create-user.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserQueryParamsDto } from './dtos/user-query-params.dto';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';
import { UserResponse } from './interfaces/user-response.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Add logger
  private readonly logger = new Logger(UsersService.name);

  /**
   * Creates a new user in the system
   *
   * @param {CreateUserDto} createUserDto - Data for creating a new user
   * @returns {Promise<{ id: string }>} ID of the newly created user
   * @throws {ConflictException} When email already exists
   * @throws {InternalServerErrorException} When user creation fails
   */
  async create(createUserDto: CreateUserDto): Promise<{ id: string }> {
    this.logger.log(`Creating user with email: ${createUserDto.email}`);

    // Check if user with this email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      this.logger.error(
        `User with email ${createUserDto.email} already exists`,
      );

      return handleError({
        defaultMessage: MESSAGES.EMAIL_ALREADY_EXISTS,
        CustomException: ConflictException,
      });
    }

    try {
      // Hash the password
      const hashedPassword = await hashPassword(createUserDto.password);

      // Set user role when creating a new user
      const role = Role.User;

      // Create new user
      const user = this.usersRepository.create({
        ...createUserDto,
        role,
        password: hashedPassword,
      });
      const savedUser = await this.usersRepository.save(user);

      this.logger.log(
        `User with email ${createUserDto.email} created successfully with id: ${savedUser.id}`,
      );

      return { id: savedUser.id };
    } catch (error: unknown) {
      this.logger.error(
        `Error creating user with email: ${createUserDto.email}, error: ${JSON.stringify(error)}`,
      );

      return handleError({
        error,
        defaultMessage: MESSAGES.CREATE_USER_FAILED,
      });
    }
  }

  /**
   * Retrieves a paginated list of users with optional filtering and sorting
   *
   * @param {UserQueryParamsDto} userQueryParamsDto - Query parameters for pagination, sorting, and filtering
   * @returns {Promise<PaginationResponse<UserResponse>>} Paginated list of users
   * @throws {InternalServerErrorException} When query fails
   */
  async findAll(
    userQueryParamsDto: UserQueryParamsDto,
  ): Promise<PaginationResponse<UserResponse>> {
    try {
      const { page, limit, sortBy, order, name, email } = userQueryParamsDto;

      // Pagination and sort query
      const query = {
        page,
        limit,
        sortBy,
        order,
      };

      // Search fields
      const searchFields = {
        name,
        email,
      };

      this.logger.log(`Fetching users with query: ${JSON.stringify(query)}`);

      // Select fields to return
      const selectFields = getSelectFields(USER_SELECT_FIELDS);
      const queryBuilder = this.usersRepository
        .createQueryBuilder('entity')
        .select(selectFields.map(field => `entity.${field}`))
        .where('entity.isDeleted = :isDeleted', { isDeleted: false });

      // Apply filters
      if (name || email) {
        applyFilters(queryBuilder, searchFields);
      }

      // Apply sorting
      if (sortBy && order) {
        applySort(queryBuilder, query);
      }

      const users = await paginate(queryBuilder, query);

      this.logger.log(
        `Users fetched successfully with query: ${JSON.stringify(query)}`,
      );

      return users;
    } catch (error: unknown) {
      this.logger.error(
        `Error fetching users with error: ${JSON.stringify(error)}`,
      );

      return handleError({
        error,
        defaultMessage: MESSAGES.GET_USERS_FAILED,
      });
    }
  }

  /**
   * Finds a single user based on provided conditions
   *
   * @param {Object} params - The search parameters
   * @param {Partial<User>} params.condition - Conditions to find the user (e.g., { id } or { email })
   * @param {boolean} params.hasSensitive - Whether to include sensitive fields in response
   * @returns {Promise<UserResponse | User>} User data with or without sensitive fields
   * @throws {NotFoundException} When no user matches the conditions
   * @throws {InternalServerErrorException} When database query fails
   */
  async findOneUser({
    condition,
    hasSensitive,
  }: {
    condition: Partial<User>;
    hasSensitive: boolean;
  }): Promise<UserResponse | User> {
    this.logger.log(
      `Fetching user with condition: ${JSON.stringify(condition)}`,
    );

    const user = await this.usersRepository.findOne({
      where: { ...condition, isDeleted: false },
      select: hasSensitive ? undefined : USER_SELECT_FIELDS,
    });

    if (!user) {
      this.logger.error(
        `User not found with condition: ${JSON.stringify(condition)}`,
      );

      return handleError({
        defaultMessage: MESSAGES.USER_NOT_FOUND,
        CustomException: NotFoundException,
      });
    }

    this.logger.log(
      `User found successfully with condition: ${JSON.stringify(condition)}`,
    );

    return user;
  }

  /**
   * Updates a user's information
   *
   * @param {string} id - id of the user to update
   * @param {UpdateUserDto} updateUserDto - Partial user data to update
   * @returns {Promise<UserResponse>} Updated user data without password field
   * @throws {NotFoundException} When user is not found
   * @throws {InternalServerErrorException} When update operation fails
   * );
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    this.logger.log(`Updating user with id: ${id}`);

    // Check if user exists and get current data
    const existingUser = await this.usersRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!existingUser) {
      this.logger.error(`User not found with id: ${id}`);

      return handleError({
        defaultMessage: MESSAGES.USER_NOT_FOUND,
        CustomException: NotFoundException,
      });
    }

    try {
      // Handle password hashing if included in update
      const { password, ...updateData } = updateUserDto;
      const hashedPassword = password && (await hashPassword(password));

      // Prepare update payload
      const updatePayload: UpdateUserDto = {
        ...updateData,
        ...(hashedPassword && { password: hashedPassword }),
      };

      // Select fields to return
      const selectFields = getSelectFields(USER_SELECT_FIELDS);
      const updatedUser = await updateEntity<User, UpdateUserDto, UserResponse>(
        this.usersRepository,
        id,
        updatePayload,
        selectFields,
        MESSAGES.UPDATE_USER_FAILED,
      );

      this.logger.log(`User with id ${id} updated successfully`);

      // Update user using helper function
      return updatedUser;
    } catch (error: unknown) {
      this.logger.error(
        `Error updating user with id: ${id} and error: ${JSON.stringify(error)}`,
      );

      return handleError({
        error,
        defaultMessage: MESSAGES.UPDATE_USER_FAILED,
      });
    }
  }

  /**
   * Deletes a user from the system
   *
   * @param {string} id - ID of the user to delete
   * @returns {Promise<DeleteUserDto>} Result of the delete operation
   * @throws {NotFoundException} When user is not found
   * @throws {InternalServerErrorException} When delete operation fails
   */
  async delete(id: string): Promise<DeleteUserDto> {
    this.logger.log(`Deleting user with id: ${id}`);

    // Check if user exists and get current data
    const existingUser: User | null = await this.usersRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!existingUser) {
      this.logger.error(`User not found with id: ${id}`);

      return handleError({
        defaultMessage: MESSAGES.USER_NOT_FOUND,
        CustomException: NotFoundException,
      });
    }

    try {
      // Prepare update payload
      const updatePayload = {
        isDeleted: true,
      } as UpdateUserDto;

      // Select fields to return
      const selectFields = getSelectFields(USER_SELECT_FIELDS);

      // Update user using helper function
      const updatedUser = await updateEntity<User, UpdateUserDto, UserResponse>(
        this.usersRepository,
        id,
        updatePayload,
        selectFields,
        MESSAGES.UPDATE_USER_FAILED,
      );

      this.logger.log(`User with id ${id} deleted successfully`);

      return {
        success: true,
        id: updatedUser.id,
      };
    } catch (error: unknown) {
      this.logger.error(
        `Error deleting user with id: ${id} and error: ${JSON.stringify(error)}`,
      );

      return handleError({
        error,
        defaultMessage: MESSAGES.DELETE_USER_FAILED,
      });
    }
  }

  /**
   * Validates user credentials for authentication
   *
   * @param {string} email - User's email address
   * @param {string} pass - User's plaintext password to validate
   * @returns {Promise<User | null>} Returns the user object if validation succeeds, null otherwise
   */
  async validateUser(email: string, pass: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email, isDeleted: false },
      });

      if (!user) {
        return null;
      }

      const isValidPassword = await isPasswordValid(pass, user.password);

      if (!isValidPassword || !user.email) {
        return null;
      }

      return user;
    } catch (error) {
      return handleError({
        error,
        defaultMessage: MESSAGES.INVALID_CREDENTIALS,
      });
    }
  }
}
