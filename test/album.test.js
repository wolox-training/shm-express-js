const request = require('supertest');
const dictum = require('dictum.js');
const { albumMock, errorAlbumMock } = require('./mocks/albums');

const { signUp, signIn } = require('./utils/users');

const app = require('../app');
const controller = request(app);

jest.mock('request-promise');

describe('POST /albums/:id', () => {
  beforeEach(() => {
    albumMock();
  });

  afterEach(() => jest.clearAllMocks());

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

  test('Test when you buy an album and the external API fails.', () => {
    errorAlbumMock();
    return signUp()
      .then(() => signIn())
      .then(({ body }) => controller.post('/albums/1').set({ token: body.token }))
      .then(response => {
        const { message, internal_code } = response.body;
        expect({ message, internal_code }).toStrictEqual({
          message: 'Error consuming album API',
          internal_code: 'error_consuming_album_api'
        });
        dictum.chai(response, 'Test when you buy an album and the external API fails.');
      });
  });
});
