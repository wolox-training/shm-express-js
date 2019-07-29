const request = require('supertest');
const dictum = require('dictum.js');

const { albumMock, errorAlbumMock } = require('./mocks/albums');
const { signUp, signIn, createAdmin } = require('./utils/users');
const app = require('../app');

const controller = request(app);

jest.mock('request-promise');

beforeEach(() => {
  albumMock();
});
afterEach(() => jest.clearAllMocks());

describe('POST /albums/:id', () => {
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

describe('GET /users/:userId/albums', () => {
  const userAdmin = {
    firstName: 'Nick',
    lastName: 'Hull',
    email: 'nick.hull@wolox.co',
    password: '$2b$10$RRxm4aogjwxe.QNoZJfbxuJrCHPD5hv5XR4JT.kUlIXfEE9qoR3B6',
    role: 'admin'
  };
  test('Successful test to list purchased albums', () =>
    signUp()
      .then(() => signIn())
      .then(({ body }) =>
        controller
          .post('/albums/1')
          .set({ token: body.token })
          .then(() => controller.get('/users/1/albums').set({ token: body.token }))
      )
      .then(response => {
        const { albums } = response.body;
        expect({ status: response.statusCode, albums }).toStrictEqual({
          status: 200,
          albums: [{ id: 1, title: 'quidem molestiae enim' }]
        });
        dictum.chai(response, 'Successful test to list purchased albums');
      }));

  test('Test trying to get albums from another user', () =>
    signUp()
      .then(() => signIn())
      .then(({ body }) =>
        controller
          .post('/albums/1')
          .set({ token: body.token })
          .then(() => controller.get('/users/2/albums').set({ token: body.token }))
      )
      .then(response => {
        const { message, internal_code } = response.body;
        expect({ status: response.statusCode, message, internal_code }).toStrictEqual({
          status: 401,
          message: 'Access denied, allowed only for administrator users',
          internal_code: 'session_error'
        });
        dictum.chai(response, 'Test trying to get albums from another user');
      }));

  test('Test trying to get albums with an admin user', () =>
    signUp()
      .then(() => signIn())
      .then(({ body }) => controller.post('/albums/1').set({ token: body.token }))
      .then(() => createAdmin(userAdmin))
      .then(() =>
        signIn({
          email: 'nick.hull@wolox.co',
          password: '12345678'
        })
      )
      .then(({ body }) => controller.get('/users/1/albums').set({ token: body.token }))
      .then(response => {
        const { albums } = response.body;
        expect({ status: response.statusCode, albums }).toStrictEqual({
          status: 200,
          albums: [{ id: 1, title: 'quidem molestiae enim' }]
        });
        dictum.chai(response, 'Test trying to get albums with an admin user');
      }));
});
