import { ApiProperty } from '@nestjs/swagger';

import { MOCK_FOOD } from '@/mocks';

/**
 * Data Transfer Object for food deletion response
 *
 * This DTO encapsulates the result of a food deletion operation.
 * It contains a boolean indicating success status and the ID of the deleted food item.
 * Used as the response type for DELETE /foods/:id endpoints.
 */
export class DeleteFoodDto {
  @ApiProperty({
    description: 'Indicates if the deletion was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'ID of the deleted user',
    example: MOCK_FOOD.ID,
  })
  id: string;
}
