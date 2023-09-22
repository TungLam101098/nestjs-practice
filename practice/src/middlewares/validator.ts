import { Request, Response, NextFunction } from 'express';
import { validationResult, FieldValidationError } from 'express-validator';

interface Error {
  [key: string]: string;
}

/**
 * Middleware function for request validation and error handling
 */
const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors: Error[] = [];
  const errorStatus = 400;
  errors
    .array()
    .map((err) => extractedErrors.push({ [(err as FieldValidationError).path]: err.msg }));

  return res.status(errorStatus).send({
    code: errorStatus,
    errors: extractedErrors,
  });
};

export default validate;
