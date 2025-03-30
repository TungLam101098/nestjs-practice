import { ApiProperty } from '@nestjs/swagger';

import { generateUserWithSensitiveData } from '@/mocks';

const { email, password } = generateUserWithSensitiveData();

/**
 * Data Transfer Object for user login requests
 */
export class LoginRequestDto {
  @ApiProperty({
    type: String,
    description: 'Email',
    example: email,
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'Password',
    example: password,
  })
  password: string;
}
