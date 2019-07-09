const request = require('supertest');
const dictum = require('dictum.js');

const app = require('../app');
const { externalMockAlbum, externalMockPhotos } = require('../app/util');
const { User } = require('../app/models');

const controller = request(app);

const userAdmin = {
  firstName: 'Nick',
  lastName: 'Hull',
  email: 'nick.hull@wolox.co',
  password: '$2b$10$RRxm4aogjwxe.QNoZJfbxuJrCHPD5hv5XR4JT.kUlIXfEE9qoR3B6',
  role: 'admin'
};

const signIn = () =>
  controller.post('/users').send({
    firstName: 'John',
    lastName: 'Katzenbach',
    email: 'john.katz@wolox.co',
    password: '12345678',
    confirm_password: '12345678'
  });

externalMockAlbum();
externalMockPhotos();

describe('POST /albums/:id', () => {
  test('Successful test when buying an album', () =>
    signIn().then(() =>
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
    signIn().then(() =>
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

describe('GET /users/:user_id/albums', () => {
  test('Successful test to list purchased albums', () =>
    signIn().then(() =>
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
            .then(() => controller.get('/users/1/albums').set({ token: body.token }))
        )
        .then(response => {
          const { albums } = response.body;
          expect({ status: response.statusCode, albums }).toStrictEqual({
            status: 200,
            albums: [{ id: 1, title: 'quidem molestiae enim' }]
          });
          dictum.chai(response, 'Successful test to list purchased albums');
        })
    ));

  test('Test trying to get albums from another user', () =>
    signIn().then(() =>
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
            .then(() => controller.get('/users/2/albums').set({ token: body.token }))
        )
        .then(response => {
          const { message, internal_code } = response.body;
          expect({ status: response.statusCode, message, internal_code }).toStrictEqual({
            status: 403,
            message: 'Access denied, allowed only for administrator users',
            internal_code: 'session_error'
          });
          dictum.chai(response, 'Test trying to get albums from another user');
        })
    ));

  test('Test trying to get albums with an admin user', () =>
    signIn()
      .then(() => User.create(userAdmin))
      .then(() =>
        controller
          .post('/users/sessions')
          .send({
            email: 'john.katz@wolox.co',
            password: '12345678'
          })
          .then(({ body }) => controller.post('/albums/1').set({ token: body.token }))
          .then(() =>
            controller.post('/users/sessions').send({
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
          })
      ));
});

describe('GET /users/albums/:id/photos', () => {
  test('Successful test when listing the photos of an album purchased by a regular user', () =>
    signIn().then(() =>
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
            .then(() => controller.get('/users/albums/1/photos').set({ token: body.token }))
        )
        .then(response => {
          const { albumPhotos } = response.body;
          expect({ status: response.statusCode, albumPhotos }).toStrictEqual({
            status: 200,
            albumPhotos: ['https://via.placeholder.com/600/92c952', 'https://via.placeholder.com/600/771796']
          });
          dictum.chai(response, 'Successful test when listing the photos of the purchased album');
        })
    ));

  test('Successful test when listing the photos of an album purchased by a user admin', () =>
    User.create(userAdmin).then(() =>
      controller
        .post('/users/sessions')
        .send({
          email: 'nick.hull@wolox.co',
          password: '12345678'
        })
        .then(({ body }) =>
          controller
            .post('/albums/1')
            .set({ token: body.token })
            .then(() => controller.get('/users/albums/1/photos').set({ token: body.token }))
        )
        .then(response => {
          const { albumPhotos } = response.body;
          expect({ status: response.statusCode, albumPhotos }).toStrictEqual({
            status: 200,
            albumPhotos: ['https://via.placeholder.com/600/92c952', 'https://via.placeholder.com/600/771796']
          });
          dictum.chai(response, 'Successful test when listing the photos of the purchased album');
        })
    ));
});
