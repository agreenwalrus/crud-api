import { User } from '../entity/user.js';

class Database {
  private _users: Array<User>;

  constructor() {
    this._users = [];
  }

  save(user: User): User {
    this._users.push(user);
    return user;
  }

  filterById(id: string): User | undefined {
    return this._users.find((user) => user.id === id);
  }

  select(): Array<User> {
    return this._users;
  }

  delete(id: string): boolean {
    const indexDeleted = this._getIndex(id);
    if (indexDeleted === -1) return false;
    this._users.splice(indexDeleted, 1);
    return true;
  }

  update(user: User) {
    const updatedIndex = this._getIndex(user.id);
    if (updatedIndex === -1) return false;
    this._users[updatedIndex] = user;
    return user;
  }

  private _getIndex(id: string) {
    return this._users.findIndex((user) => user.id === id);
  }
}

export default new Database();
