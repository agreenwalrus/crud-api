import Database from '../data/Database.js';
import { User } from '../entity/user.js';
import { v4 as uuidv4 } from 'uuid';
import { CrudError } from '../utils/error.js';
import { NOT_FOUND_ERROR_CODE, NOT_FOUND_ERROR_MESSAGE } from '../utils/constats.js';

export class UserRepository {
  private readonly usersDb = Database;

  create(user: { username: string; age: number; hobbies: Array<string> }) {
    return this.usersDb.save(new User(uuidv4(), user.username, user.age, user.hobbies));
  }

  update(user: { id: string; username?: string; age?: number; hobbies?: Array<string> }) {
    const currentUser = this.find(user.id);
    if (currentUser === undefined) throw new CrudError(NOT_FOUND_ERROR_MESSAGE, NOT_FOUND_ERROR_CODE);
    return this.usersDb.update(
      new User(
        user.id,
        user.username ?? currentUser.username,
        user.age ?? currentUser.age,
        user.hobbies ?? currentUser.hobbies,
      ),
    );
  }

  delete(id: string) {
    this.usersDb.delete(id);
  }

  find(id: string) {
    return this.usersDb.filterById(id);
  }

  findAll() {
    return this.usersDb.select();
  }
}
