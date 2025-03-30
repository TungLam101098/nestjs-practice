import { ApiProperty } from '@nestjs/swagger';

import { MetadataDto } from '@/dtos';
import { PaginationResponse } from '@/interfaces';

import { UserResponseDto } from './user-response.dto';

/**
 * Data Transfer Object for paginated users response
 * Implements PaginationResponse interface with UserResponseDto type
 * Used for returning lists of users with pagination metadata
 */
export class UsersResponseDto implements PaginationResponse<UserResponseDto> {
  @ApiProperty({
    description: 'List of users',
    type: [UserResponseDto],
  })
  data: UserResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetadataDto,
  })
  metadata: MetadataDto;
}
