import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { MESSAGES } from '@/constants';
import { Roles } from '@/decorators';
import { AuthenticatedRequest } from '@/interfaces';
import { JoiValidationPipe, UuidValidationPipe } from '@/pipes';
import { handleError } from '@/utils';

import { CreateUserDto, CreateUserSchema } from './dtos/create-user.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { UpdateUserDto, UpdateUserSchema } from './dtos/update-user.dto';
import {
  UserQueryParamsDto,
  UserQueryParamsSchema,
} from './dtos/user-query-params.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { UsersResponseDto } from './dtos/users-response.dto';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiCreatedResponse({
    type: User,
    description: 'Create user successfully',
  })
  @ApiBadRequestResponse({
    description: MESSAGES.VALIDATE_FAILED,
  })
  @ApiUnauthorizedResponse({
    description: MESSAGES.MISSING_TOKEN,
  })
  @ApiConflictResponse({
    description: MESSAGES.EMAIL_ALREADY_EXISTS,
  })
  async create(
    @Body(new JoiValidationPipe(CreateUserSchema)) createUserDto: CreateUserDto,
  ): Promise<{ id: string }> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get all users with pagination (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users found successfully',
    type: UsersResponseDto,
  })
  @ApiBadRequestResponse({
    description: MESSAGES.VALIDATE_FAILED,
  })
  @ApiUnauthorizedResponse({
    description: MESSAGES.MISSING_TOKEN,
  })
  @UseInterceptors(CacheInterceptor)
  async findAll(
    @Query(new JoiValidationPipe(UserQueryParamsSchema))
    userQueryParamsDto: UserQueryParamsDto,
  ): Promise<UsersResponseDto> {
    return await this.usersService.findAll(userQueryParamsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'User id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: MESSAGES.VALIDATE_FAILED,
  })
  @ApiUnauthorizedResponse({
    description: MESSAGES.MISSING_TOKEN,
  })
  @ApiNotFoundResponse({
    description: MESSAGES.USER_NOT_FOUND,
  })
  @UseInterceptors(CacheInterceptor)
  async findById(
    @Param('id', UuidValidationPipe) id: string,
  ): Promise<UserResponseDto> {
    return await this.usersService.findOneUser({
      condition: { id },
      hasSensitive: false,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'User id' })
  @ApiBody({
    type: UpdateUserDto,
    description: 'User data to update',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: MESSAGES.VALIDATE_FAILED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: MESSAGES.USER_NOT_FOUND,
  })
  @ApiUnauthorizedResponse({
    description: MESSAGES.MISSING_TOKEN,
  })
  async update(
    @Param('id', UuidValidationPipe) userIdFromParam: string,
    @Body(new JoiValidationPipe(UpdateUserSchema)) updateUserDto: UpdateUserDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<UserResponseDto> {
    const { id, role } = req.user;
    const isUpdatingOwnProfile = userIdFromParam === id || role === Role.Admin;

    // Only allow Admin to update other users' profiles
    if (!isUpdatingOwnProfile) {
      return handleError({
        defaultMessage: MESSAGES.PERMISSION_DENIED,
        CustomException: UnauthorizedException,
      });
    }

    return await this.usersService.update(userIdFromParam, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete user by id (Admin only)' })
  @ApiParam({ name: 'id', type: 'string', description: 'User id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DeleteUserDto,
  })
  @ApiBadRequestResponse({
    description: MESSAGES.VALIDATE_FAILED,
  })
  @ApiUnauthorizedResponse({
    description: MESSAGES.MISSING_TOKEN,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: MESSAGES.USER_NOT_FOUND,
  })
  async delete(
    @Param('id', UuidValidationPipe) id: string,
  ): Promise<DeleteUserDto> {
    return await this.usersService.delete(id);
  }
}
