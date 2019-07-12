const request = require('supertest');
const dictum = require('dictum.js');

const app = require('../app');
const utils = require('../app/utils');

const controller = request(app);

const user = {
  firstName: 'John',
  lastName: 'Katzenbach',
  email: 'john.katz@wolox.co',
  password: '12345678',
  confirm_password: '12345678'
};

const signIn = () => controller.post('/users').send(user);

describe('POST /users/sessions', () => {
  test('Successful test when sign in', () =>
    signIn().then(() =>
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
    signIn().then(() =>
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
    signIn().then(() =>
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
