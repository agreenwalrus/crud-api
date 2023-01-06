import { UserController } from '../controllers/user.controller.js';
import {
  CREATE_STATUS_CODE,
  DELETE_STATUS_CODE,
  INTERNAL_ERROR_MESSAGE,
  INTERNAL_ERROR_STATUS_CODE,
  OK_STATUS_CODE,
} from '../utils/constats.js';
import { CrudError } from '../utils/error.js';

export class UserService {
  private readonly controller;

  constructor(controller: UserController) {
    this.controller = controller;
  }

  private async getBody(req: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let data = '';
      req.on('data', (chunck: string) => {
        data += chunck;
      });
      req.on('end', () => resolve(JSON.parse(data.toString())));
      req.on('error', reject);
    });
  }

  getAll(req: any, res: any) {
    res.statusCode = OK_STATUS_CODE;
    res.write(JSON.stringify(this.controller.findAll()));
  }

  get(req: any, res: any) {
    res.statusCode = OK_STATUS_CODE;
    res.write(JSON.stringify(this.controller.find(this.parseId(req.url))));
  }

  async put(req: any, res: any) {
    const userInfo = await this.getBody(req);
    this.controller.update({
      id: this.parseId(req.url),
      username: userInfo.username,
      age: userInfo.age,
      hobbies: userInfo.hobbies,
    });
    res.statusCode = OK_STATUS_CODE;
  }

  async post(req: any, res: any) {
    const userInfo = await this.getBody(req);
    const user = this.controller.create({
      username: userInfo.username,
      age: userInfo.age,
      hobbies: userInfo.hobbies,
    });
    res.statusCode = CREATE_STATUS_CODE;
    if (user) res.write(JSON.stringify(user));
    else throw new CrudError(INTERNAL_ERROR_MESSAGE, INTERNAL_ERROR_STATUS_CODE);
  }

  delete(req: any, res: any) {
    res.statusCode = DELETE_STATUS_CODE;
    this.controller.delete(this.parseId(req.url));
  }

  parseId(url: string) {
    const [domain, apiName, id, ...other] = url.substring(1).split('/') ?? [];
    return id;
  }
}
