import { BAD_REQUEST_STATUS_CODE } from './constats.js';

export class CrudError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

export class ValidationError extends CrudError {
  constructor(key: string, reason: string) {
    super(`"${key}" ${reason}`, BAD_REQUEST_STATUS_CODE);
  }
}
