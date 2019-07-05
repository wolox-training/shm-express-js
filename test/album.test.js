const request = require('supertest');
const dictum = require('dictum.js');
const nock = require('nock');

const app = require('../app');

const controller = request(app);

describe('POST /albums/:id', () => {
  beforeEach(() =>
    nock('https://jsonplaceholder.typicode.com')
      .get('/albums')
      .times(2)
      .query({ id: '1' })
      .reply(200, [
        {
          id: 1,
          title: 'quidem molestiae enim'
        }
      ])
  );

  test('Successful test when buying an album', () =>
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
          .then(({ body }) => controller.post('/albums/1').set({ token: body.token }))
          .then(response => {
            const { album } = response.body;
            expect({ status: response.statusCode, id: album.id, title: album.title }).toStrictEqual({
              status: 201,
              id: 1,
              title: 'quidem molestiae enim'
            });
            dictum.chai(response, 'Successful test when buying an album');
          })
      ));

  test('Successful test when buying an album', () =>
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
          .then(({ body }) =>
            controller
              .post('/albums/1')
              .set({ token: body.token })
              .then(() => controller.post('/albums/1').set({ token: body.token }))
          )
          .then(response => {
            const { message, internal_code } = response.body;
            expect({ message, internal_code }).toStrictEqual({
              message: 'Duplicate purchase of an album is not allowed',
              internal_code: 'buy_album_error'
            });
            dictum.chai(response, 'Successful test updating regular user to administrator');
          })
      ));
});
