import { TypeORMError } from 'typeorm';

export class TypeORMTransformError extends TypeORMError {
  constructor(message?: string) {
    super(message);
  }
}
