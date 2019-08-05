const request = require('supertest');
const dictum = require('dictum.js');

const app = require('../app');
const { validateToken } = require('../app/utils');
const { signUp, signIn } = require('./utils/users');
const { expireToken } = require('./utils/users');

const controller = request(app);

describe('POST /users/sessions', () => {
  test('Successful test when sign in', () =>
    signUp()
      .then(() => signIn())
      .then(userSignIn =>
        validateToken(userSignIn.body.token).then(token => ({
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
      }));

  test('Test when you sign in with an email that does not exist', () =>
    signUp()
      .then(() =>
        controller.post('/users/sessions').send({
          email: 'john.katz@wolox.cl',
          password: '12345678'
        })
      )
      .then(response => {
        const { message, internal_code } = response.body;
        expect({ status: response.statusCode, message, internal_code }).toStrictEqual({
          status: 401,
          message: 'Your email or password is incorrect.',
          internal_code: 'session_error'
        });
        dictum.chai(response, 'Test when you sign in with an email that does not exist');
      }));

  test('Test when you sign in with the wrong password', () =>
    signUp()
      .then(() =>
        controller.post('/users/sessions').send({
          email: 'john.katz@wolox.co',
          password: '12345'
        })
      )
      .then(response => {
        const { message, internal_code } = response.body;
        expect({ status: response.statusCode, message, internal_code }).toStrictEqual({
          status: 401,
          message: 'Your email or password is incorrect.',
          internal_code: 'session_error'
        });
        dictum.chai(response, 'Test when you sign in with the wrong password');
      }));

  test('Test trying to sign in with a token that has expired', () =>
    signUp()
      .then(() => signIn())
      .then(({ body }) => expireToken(body))
      .then(token => controller.get('/users').set({ token }))
      .then(response => {
        const { message, internal_code } = response.body;
        expect({ status: response.statusCode, message, internal_code }).toStrictEqual({
          status: 401,
          message: 'Session error, jwt expired',
          internal_code: 'session_error'
        });
        dictum.chai(response, 'Test when you sign in with the wrong password');
      }));
});

describe('POST /users/sessions/invalidate_all', () => {
  test('Successful test by disabling all sessions of a user', () =>
    signUp()
      .then(() => signIn())
      .then(({ body }) => controller.post('/users/sessions/invalidate_all').set({ token: body.token }))
      .then(response => {
        expect({ status: response.statusCode, message: response.body.message }).toStrictEqual({
          status: 200,
          message: 'All sessions have been disabled'
        });
        dictum.chai(response, 'All sessions have been disabled');
      }));

  test('Test tried to disable sessions with a session already disabled', () =>
    signUp()
      .then(() => signIn())
      .then(({ body }) =>
        controller
          .post('/users/sessions/invalidate_all')
          .set({ token: body.token })
          .then(() => controller.post('/users/sessions/invalidate_all').set({ token: body.token }))
      )
      .then(response => {
        expect({ status: response.statusCode, message: response.body.message }).toStrictEqual({
          status: 401,
          message: 'Session error, the token has been disabled'
        });
        dictum.chai(response, 'Test tried to disable sessions with a session already disabled');
      }));
});
