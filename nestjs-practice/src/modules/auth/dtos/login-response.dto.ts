import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for login response
 * Contains the JWT access token returned after successful authentication
 */
export class LoginResponseDto {
  @ApiProperty({
    description: 'Access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;
}
