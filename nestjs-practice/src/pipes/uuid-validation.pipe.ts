import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

import { MESSAGES, REGEX } from '@/constants';
import { handleError } from '@/utils';

@Injectable()
export class UuidValidationPipe implements PipeTransform<string> {
  transform(value: string): string {
    const isInvalidUuid = !REGEX.UUID.test(value);

    if (isInvalidUuid) {
      return handleError({
        defaultMessage: MESSAGES.INVALID_ID,
        CustomException: BadRequestException,
      });
    }

    return value;
  }
}
