import { ApiProperty } from '@nestjs/swagger';

import { MOCK_USER } from '@/mocks';

/**
 * Data Transfer Object for user deletion response
 * Represents the result of a user deletion operation
 */
export class DeleteUserDto {
  @ApiProperty({
    description: 'Indicates if the deletion was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'ID of the deleted user',
    example: MOCK_USER.ID,
  })
  id: string;
}
