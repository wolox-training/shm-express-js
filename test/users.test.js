const request = require('supertest');
const dictum = require('dictum.js');

const app = require('../app');

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
      .then(response => {
        expect(response.statusCode).toBe(201);
        return dictum.chai(response, 'Successful test creating user');
      }));

  test('User creation test when using an email in use', () => {
    controller
      .post('/users')
      .send({
        firstName: 'Maria Jose',
        lastName: 'Perez',
        email: 'jose.perez@wolox.com.ar',
        password: 'test12345'
      })
      .then(() =>
        controller
          .post('/users')
          .send({
            firstName: 'Jose',
            lastName: 'Perez',
            email: 'jose.perez@wolox.com.ar',
            password: '12345test'
          })
          .then(response => {
            expect(response.statusCode).toBe(503);
            return dictum.chai(response, 'Test when using an email in use');
          })
      );
  });

  test('User creation test when the password meets conditions', () =>
    controller
      .post('/users')
      .send({
        firstName: 'John',
        lastName: 'Katzenbach',
        email: 'john.katz@wolox.co',
        password: '123'
      })
      .then(response => {
        expect(response.statusCode).toBe(400);
        return dictum.chai(response, 'Test when the password meets conditions');
      }));

  test('User creation test when required parameters are not sent', () =>
    controller
      .post('/users')
      .send({
        email: 'john.katz@wolox.co',
        password: '12345678'
      })
      .then(response => {
        expect(response.statusCode).toBe(503);
        return dictum.chai(response, 'Test when required parameters are not sent');
      }));
});

describe('POST /users/sessions', () => {
  test('Sign in', () =>
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
          .then(response => {
            expect(response.statusCode).toBe(200);
            dictum.chai(response, 'Sign in');
          })
      ));
});
