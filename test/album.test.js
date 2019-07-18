const request = require('supertest');
const dictum = require('dictum.js');

const { signUp, signIn } = require('./utils/users');
const { albumMock } = require('./mocks/albums');

const app = require('../app');
const controller = request(app);

describe('POST /albums/:id', () => {
  albumMock();
  test('Successful test when buying an album', () =>
    signUp()
      .then(() => signIn())
      .then(({ body }) => controller.post('/albums/1').set({ token: body.token }))
      .then(response => {
        const { album } = response.body;
        expect({ status: response.statusCode, id: album.id, title: album.title }).toStrictEqual({
          status: 201,
          id: 1,
          title: 'quidem molestiae enim'
        });
        dictum.chai(response, 'Successful test when buying an album');
      }));

  test('Test when you buy the same album twice', () =>
    signUp()
      .then(() => signIn())
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
        dictum.chai(response, 'Test when you buy the same album twice');
      }));
});
