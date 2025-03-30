import { InternalServerErrorException } from '@nestjs/common';
import { ObjectLiteral, Repository, UpdateResult } from 'typeorm';

import { handleError } from './error.util';

/**
 * Updates an entity and returns specified fields
 *
 * @template T - Entity type
 * @template U - Update DTO type
 * @template R - Response type
 *
 * @param {Repository<T>} repository - TypeORM repository
 * @param {string} id - Entity ID to update
 * @param {U} updatePayload - Data to update
 * @param {string[]} selectFields - Fields to return after update
 * @param {string} errorMessage - Error message if update fails
 *
 * @returns {Promise<R>} Updated entity with selected fields
 * @throws {InternalServerErrorException} When update fails
 */
export async function updateEntity<
  T extends ObjectLiteral,
  U extends Partial<T>,
  R,
>(
  repository: Repository<T>,
  id: string,
  updatePayload: U,
  selectFields: string[],
  errorMessage: string,
): Promise<R> {
  const result: UpdateResult = await repository
    .createQueryBuilder()
    .update(repository.target)
    .set(updatePayload)
    .where('id = :id', { id })
    .returning(selectFields)
    .execute();

  const [updatedEntity] = result.raw as R[];

  if (!updatedEntity) {
    return handleError({
      defaultMessage: errorMessage,
      CustomException: InternalServerErrorException,
    });
  }

  return updatedEntity;
}
