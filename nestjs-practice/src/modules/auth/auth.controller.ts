import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { MESSAGES } from '@/constants';
import { IsPublicRoute } from '@/decorators';
import { AuthenticatedRequest } from '@/interfaces';
import {
  CreateUserDto,
  CreateUserSchema,
} from '@/modules/users/dtos/create-user.dto';
import { User } from '@/modules/users/entities/user.entity';
import { JoiValidationPipe } from '@/pipes';

import { AuthService } from './auth.service';
import { LoginRequestDto } from './dtos/login-request.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @IsPublicRoute()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'User login',
    description: 'Login with email and password',
  })
  @ApiBody({
    type: LoginRequestDto,
    description: 'User credentials',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: MESSAGES.INVALID_CREDENTIALS,
  })
  handleLogin(@Req() req: AuthenticatedRequest): LoginResponseDto {
    const user = req.user;

    return this.authService.login(user);
  }

  @Post('register')
  @IsPublicRoute()
  @ApiOperation({
    summary: 'User registration',
    description: 'Create a new user account',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User registration data',
  })
  @ApiCreatedResponse({
    type: User,
    description: 'Create user successfully',
  })
  @ApiBadRequestResponse({
    description: MESSAGES.VALIDATE_FAILED,
  })
  @ApiConflictResponse({
    description: MESSAGES.EMAIL_ALREADY_EXISTS,
  })
  async register(
    @Body(new JoiValidationPipe(CreateUserSchema)) registerDto: CreateUserDto,
  ): Promise<{ id: string }> {
    return await this.authService.register(registerDto);
  }
}
