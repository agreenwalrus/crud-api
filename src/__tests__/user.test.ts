import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';

import fetch from 'node-fetch';
import { BAD_REQUEST_STATUS_CODE, INTERNAL_ERROR_MESSAGE, NOT_FOUND_ERROR_CODE } from '../utils/constats.js';
import { server } from '../server.js';

chai.use(chaiHttp);

describe('API user', () => {
  let testUser = {
    username: 'Seriosza',
    age: 25,
    hobbies: ['anime'],
  };

  let createdUser: any;

  let updatedUser = {
    username: 'Steave',
    age: 25,
    hobbies: ['Tesla'],
  };

  it('test GET: get all users. No users are expected', async () => {
    chai
      .request(server)
      .get('/api/user')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.response).to.be.length(0);
      });
  });

  it('test POST: create new user', async () => {
    chai
      .request(server)
      .post('/api/user')
      .send(testUser)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        createdUser = res.body.response;
        expect(createdUser).to.deep.include(testUser);
        expect(createdUser.username).to.deep.equal(testUser.username);
        expect(createdUser.age).to.deep.equal(testUser.age);
        expect(createdUser.hobbies).to.deep.equal(testUser.hobbies);
      });
  });

  it('test GET: get specific user', async () => {
    chai
      .request(server)
      .get(`/api/user/${createdUser.id}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.response).to.deep.equal(createdUser);
      });
  });

  it('test PUT: update user', async () => {
    chai
      .request(server)
      .put(`/api/user/${createdUser.id}`)
      .send(updatedUser)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        const resUser = res.body.response;
        expect(resUser).to.deep.include(updatedUser);
        expect(resUser.username).to.deep.equal(updatedUser.username);
        expect(resUser.age).to.deep.equal(updatedUser.age);
        expect(resUser.hobbies).to.deep.equal(updatedUser.hobbies);
      });
  });

  it('test DELETE: pass wrong id', async () => {
    chai
      .request(server)
      .delete('/api/user/wrong_id')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.deep.equal({
          error: { code: BAD_REQUEST_STATUS_CODE, message: '"id" must be in the format of uuid v4', details: '' },
        });
      });
  });
});
