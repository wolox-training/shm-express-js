const request = require('supertest');
const dictum = require('dictum.js');

const app = require('../app');
const { User } = require('../app/models');
const utils = require('../app/utils');

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
            const { message, internal_code } = response.body;
            expect({ status: response.statusCode, message, internal_code }).toStrictEqual({
              status: 400,
              message: ['The email is already registered'],
              internal_code: 'bad_request'
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
        const { message, internal_code } = response.body;
        expect({ status: response.statusCode, message, internal_code }).toStrictEqual({
          status: 400,
          message: ['Password should be at least 8 chars long'],
          internal_code: 'bad_request'
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
        const { message, internal_code } = response.body;
        expect({ status: response.statusCode, message, internal_code }).toStrictEqual({
          status: 400,
          message: ['First Name should be at least 2 chars long and maximum of 50 chars'],
          internal_code: 'bad_request'
        });
        dictum.chai(response, 'Test when required parameters are not sent');
      }));
});

describe('POST /users/sessions', () => {
  const user = {
    firstName: 'John',
    lastName: 'Katzenbach',
    email: 'john.katz@wolox.co',
    password: '12345678',
    confirm_password: '12345678'
  };
  test('Successful test when sign in', () =>
    controller
      .post('/users')
      .send(user)
      .then(() =>
        controller
          .post('/users/sessions')
          .send({
            email: 'john.katz@wolox.co',
            password: '12345678'
          })
          .then(userSignIn =>
            utils.validateToken(userSignIn.body.token).then(token => ({
              response: userSignIn,
              token
            }))
          )
          .then(({ response, token }) => {
            const { firstName, lastName } = token;
            expect({ firstName, lastName }).toStrictEqual({
              firstName: 'John',
              lastName: 'Katzenbach'
            });
            dictum.chai(response, 'Successful login');
          })
      ));

  test('Test when you sign in with an email that does not exist', () =>
    controller
      .post('/users')
      .send(user)
      .then(() =>
        controller
          .post('/users/sessions')
          .send({
            email: 'john.katz@wolox.cl',
            password: '12345678'
          })
          .then(response => {
            const { message, internal_code } = response.body;
            expect({ status: response.statusCode, message, internal_code }).toStrictEqual({
              status: 401,
              message: 'Your email or password is incorrect.',
              internal_code: 'session_error'
            });
            dictum.chai(response, 'Test when you sign in with an email that does not exist');
          })
      ));

  test('Test when you sign in with the wrong password', () =>
    controller
      .post('/users')
      .send(user)
      .then(() =>
        controller
          .post('/users/sessions')
          .send({
            email: 'john.katz@wolox.co',
            password: '12345'
          })
          .then(response => {
            const { message, internal_code } = response.body;
            expect({ status: response.statusCode, message, internal_code }).toStrictEqual({
              status: 401,
              message: 'Your email or password is incorrect.',
              internal_code: 'session_error'
            });
            dictum.chai(response, 'Test when you sign in with the wrong password');
          })
      ));
});

describe('GET /users', () => {
  test('Successful test to get list of users', () =>
    controller
      .post('/users')
      .send({
        firstName: 'John',
        lastName: 'Katzenbach',
        email: 'john.katz@wolox.co',
        password: '12345678',
        confirm_password: '12345678'
      })
      .then(() =>
        controller
          .post('/users/sessions')
          .send({
            email: 'john.katz@wolox.co',
            password: '12345678'
          })
          .then(({ body }) => controller.get('/users').set({ token: body.token }))
          .then(response => {
            expect(response.body).toStrictEqual({
              users: [
                {
                  id: 1,
                  firstName: 'John',
                  lastName: 'Katzenbach',
                  email: 'john.katz@wolox.co'
                }
              ],
              pageCount: 1,
              itemCount: 1,
              page: 1
            });
            dictum.chai(response, 'Test get user list');
          })
      ));
});
