import { ApiProperty } from '@nestjs/swagger';

import { generateUserResponse } from '@/mocks';

import { Role } from '../enums/role.enum';
import { UserResponse } from '../interfaces/user-response.interface';

const { id, email, name, phone, createdAt, updatedAt } = generateUserResponse();

/**
 * Data Transfer Object for user response
 * Used for returning user data in API responses
 * Implements UserResponse interface to ensure type consistency
 */
export class UserResponseDto implements UserResponse {
  @ApiProperty({
    example: id,
  })
  id: string;

  @ApiProperty({
    example: email,
  })
  email: string;

  @ApiProperty({
    example: name,
  })
  name: string;

  @ApiProperty({
    example: Role.User,
  })
  role: string;

  @ApiProperty({
    example: phone,
  })
  phone: string;

  @ApiProperty({
    example: createdAt,
  })
  createdAt: Date;

  @ApiProperty({
    example: updatedAt,
  })
  updatedAt: Date;
}
