import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

import { MESSAGES } from '@/constants';
import { RequestParameter } from '@/enums';
import { handleError, isEmptyObject } from '@/utils';

@Injectable()
export class JoiValidationPipe<T> implements PipeTransform<T, T> {
  constructor(private schema: ObjectSchema) {}

  transform(value: T, metadata: ArgumentMetadata): T {
    const isEmptyValue = isEmptyObject(value);
    const isEmptyBodyRequest =
      isEmptyValue && metadata.type === RequestParameter.Body;

    if (isEmptyBodyRequest) {
      return handleError({
        defaultMessage: MESSAGES.VALIDATE_EMPTY_BODY,
        ExceptionClass: BadRequestException,
      });
    }

    const { error } = this.schema.validate(value, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      return handleError({
        error,
        defaultMessage: MESSAGES.VALIDATE_FAILED,
        ExceptionClass: BadRequestException,
      });
    }

    return value;
  }
}
