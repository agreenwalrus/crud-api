import { expect } from 'chai';
import fetch from 'node-fetch';
import { PORT } from '../config.js';
import { User } from '../entity/user.js';
import { BAD_REQUEST_STATUS_CODE, INTERNAL_ERROR_MESSAGE, NOT_FOUND_ERROR_CODE } from '../utils/constats.js';

async function sendData(url: string, method: string, data = {}) {
  const response = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(method !== 'GET' && { body: JSON.stringify(data) }),
  });

  return response;
}

describe('API user', () => {
  let testUser = {
    username: 'Seriosza',
    age: 25,
    hobbies: ['anime'],
  };

  let createdUser: User;

  let updatedUser = {
    username: 'Steave',
    age: 25,
    hobbies: ['Tesla'],
  };

  it('test GET: get all users. No users are expected', async () => {
    const response: any = await sendData(`http://127.0.0.1:${PORT}/api/user`, 'GET');
    const body = await response.json();

    expect(response.status).to.equal(200);
    expect(body.response).to.be.length(0);
  });

  it('test POST: create new user', async () => {
    const response: any = await sendData(`http://127.0.0.1:${PORT}/api/user`, 'POST', testUser);
    createdUser = await response.json().then((r: any) => r.response);

    expect(response.status).to.equal(201);
    expect(createdUser).to.deep.include(testUser);
  });

  it('test GET: get specific user', async () => {
    const response: any = await sendData(`http://127.0.0.1:${PORT}/api/user/${createdUser.id}`, 'GET');
    const body = await response.json();

    expect(response.status).to.equal(200);
    expect(body.response).to.deep.include(createdUser);
  });

  it('test PUT: update user', async () => {
    const response: any = await sendData(`http://127.0.0.1:${PORT}/api/user/${createdUser.id}`, 'PUT', updatedUser);
    const body = await response.json();

    expect(response.status).to.equal(200);
    expect(body.response).to.deep.include({ id: createdUser.id, ...updatedUser });
  });

  it('test DELETE: pass wrong id', async () => {
    const response: any = await sendData(`http://127.0.0.1:${PORT}/api/user/wrong_id`, 'DELETE');
    const body = await response.json();

    expect(response.status).to.equal(400);
    expect(body).to.be.deep.equal({
      error: { code: BAD_REQUEST_STATUS_CODE, message: '"id" must be in the format of uuid v4', details: '' },
    });
  });
});
