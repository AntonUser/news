import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';

function flatten(errors: ValidationError[]): ValidationError[] {
  return errors.flatMap((error) => {
    if (error.children && error.children.length) {
      return flatten(error.children).map((v) => ({
        ...v,
        property: [error.property, v.property].join('.'),
      }));
    }

    return [error];
  });
}

export class ValidationException extends HttpException {
  constructor(errors: ValidationError[]) {
    super(
      flatten(errors).reduce((acc, v) => {
        return {
          ...acc,
          [v.property]: Object.values(v.constraints || {}),
        };
      }, {}),
      HttpStatus.BAD_REQUEST,
    );
  }
}
