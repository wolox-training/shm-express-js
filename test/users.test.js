const request = require('supertest');
const dictum = require('dictum.js');

const app = require('../app');
const { User } = require('../app/models');

const controller = request(app);

describe('POST /users', () => {
  test('Successful test when registering user', () =>
    controller
      .post('/users')
      .send({
        firstName: 'John',
        lastName: 'Katzenbach',
        email: 'john.katz@wolox.co',
        password: '12345678',
        confirm_password: '12345678'
      })
      .then(response =>
        User.findOne({
          where: { email: 'john.katz@wolox.co' }
        }).then(({ firstName, lastName, email }) => {
          expect({ firstName, lastName, email }).toStrictEqual({
            firstName: 'John',
            lastName: 'Katzenbach',
            email: 'john.katz@wolox.co'
          });
          dictum.chai(response, 'Successful test creating user');
        })
      ));

  test('User creation test when using an email in use', () =>
    controller
      .post('/users')
      .send({
        firstName: 'Maria Jose',
        lastName: 'Perez',
        email: 'jose.perez@wolox.com.ar',
        password: 'test12345',
        confirm_password: 'test12345'
      })
      .then(() =>
        controller
          .post('/users')
          .send({
            firstName: 'Jose',
            lastName: 'Perez',
            email: 'jose.perez@wolox.com.ar',
            password: '12345test',
            confirm_password: '12345test'
          })
          .then(response => {
            const { message, internalCode } = response.body;
            expect({ status: response.statusCode, message, internalCode }).toStrictEqual({
              status: 400,
              message: 'Invalid request parameters',
              internalCode: 'bad_request'
            });
            dictum.chai(response, 'Successful test trying to create an user with an email in use.');
          })
      ));

  test('User creation test when the password meets conditions', () =>
    controller
      .post('/users')
      .send({
        firstName: 'John',
        lastName: 'Katzenbach',
        email: 'john.katz@wolox.co',
        password: '123',
        confirm_password: '123'
      })
      .then(response => {
        const { message, internalCode } = response.body;
        expect({ status: response.statusCode, message, internalCode }).toStrictEqual({
          status: 400,
          message: 'Invalid request parameters',
          internalCode: 'bad_request'
        });
        dictum.chai(response, 'Test when the password meets conditions');
      }));

  test('User creation test when required parameters are not sent', () =>
    controller
      .post('/users')
      .send({
        lastName: 'Katzenbach',
        email: 'john.katz@wolox.co',
        password: '12345678',
        confirm_password: '12345678'
      })
      .then(response => {
        const { message, internalCode } = response.body;
        expect({ status: response.statusCode, message, internalCode }).toStrictEqual({
          status: 400,
          message: 'Invalid request parameters',
          internalCode: 'bad_request'
        });
        dictum.chai(response, 'Test when required parameters are not sent');
      }));
});
