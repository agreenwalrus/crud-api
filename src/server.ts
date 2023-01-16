import http from 'http';
import { CrudError } from './utils/error.js';
import {
  INTERNAL_ERROR_MESSAGE,
  INTERNAL_ERROR_STATUS_CODE,
  NOT_FOUND_ERROR_CODE,
  OK_STATUS_CODE,
  NOT_FOUND_ERROR_MESSAGE,
} from './utils/constats.js';
import { UserController } from './controllers/user.controller.js';
import { UserRepository } from './repositories/user.repository.js';
import { UserService } from './service/user.service.js';

export function runCrudServer(port: number) {
  const server = http.createServer(async (req, res) => {
    try {
      const service = new UserService(new UserController(new UserRepository()));
      const [hostName, path, id, ...other] = req.url?.substring(1).split('/') ?? [];
      if (other.length !== 0) throw new CrudError(NOT_FOUND_ERROR_MESSAGE, NOT_FOUND_ERROR_CODE);
      switch (req.method) {
        case 'GET':
          if (id !== undefined) {
            service.get(req, res);
          } else {
            service.getAll(req, res);
          }
          break;
        case 'PUT':
          await service.put(req, res);
          break;
        case 'DELETE':
          service.delete(req, res);
          break;
        case 'POST':
          await service.post(req, res);
          break;
        case 'OPTIONS':
          res.statusCode = OK_STATUS_CODE;
          break;
        default:
          new CrudError(NOT_FOUND_ERROR_MESSAGE, NOT_FOUND_ERROR_CODE);
          break;
      }
    } catch (err) {
      let message = '';
      let details = '';
      if (err instanceof CrudError) {
        res.statusCode = err.code;
        message = `${err.message}`;
      } else if (err instanceof Error) {
        res.statusCode = INTERNAL_ERROR_STATUS_CODE;
        message = `${INTERNAL_ERROR_MESSAGE}\n${err.message}`;
        details = err.stack || '';
      }
      const error = { error: { code: res.statusCode, message: message, details: details } };
      res.write(JSON.stringify(error));
    } finally {
      res.end();
    }
  });

  server.listen(port, () => console.log(`Server is running on port ${port}`));
}
