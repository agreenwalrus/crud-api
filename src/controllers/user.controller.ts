//REST to the business logic

import { UserRepository } from '../repositories/user.repository.js';
import {
  INTERNAL_ERROR_MESSAGE,
  INTERNAL_ERROR_STATUS_CODE,
  NOT_FOUND_ERROR_CODE,
  NOT_FOUND_ERROR_MESSAGE,
} from '../utils/constats.js';
import { CrudError } from '../utils/error.js';
import { validator } from '../utils/validator.js';

export class UserController {
  private readonly repository;
  private readonly validator = validator;
  private readonly model = 'user';

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  create(user: { username: string; age: number; hobbies: Array<string> }) {
    this.validator.validate(this.model, user, 2 ** 1 + 2 ** 2 + 2 ** 3);
    return this.repository.create(user);
  }

  update(user: { id: string; username: string; age: number; hobbies: Array<string> }) {
    this.validator.validate(this.model, user);
    this.find(user.id);
    return this.repository.update(user);
  }

  delete(id: string) {
    this.validator.validate(this.model, { id: id }, 2 ** 0);
    this.find(id);
    this.repository.delete(id);
  }

  find(id: string) {
    this.validator.validate(this.model, { id: id }, 2 ** 0);
    const user = this.repository.find(id);
    if (!user) {
      throw new CrudError(NOT_FOUND_ERROR_MESSAGE, NOT_FOUND_ERROR_CODE);
    }
    return user;
  }

  findAll() {
    return this.repository.findAll();
  }
}
