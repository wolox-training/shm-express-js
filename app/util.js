const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken-promisified');
const nock = require('nock');

const errors = require('./errors');
const { session } = require('../config').common;

exports.passwordEncryption = user =>
  bcrypt
    .hash(user.password, session.salt_rounds)
    .then(password => ({
      ...user,
      password
    }))
    .catch(() => {
      throw errors.encryptionError();
    });

exports.passwordDecryption = (password, hash) =>
  bcrypt.compare(password, hash).catch(() => {
    throw errors.decryptionError();
  });

exports.generateToken = ({ id, firstName, lastName, email, role }) =>
  jwt.signAsync({ id, firstName, lastName, email, role }, session.seed).catch(() => {
    throw errors.generateTokenError();
  });

exports.validateToken = token =>
  jwt.verifyAsync(token, session.seed).catch(() => {
    throw errors.verifyTokenError();
  });

exports.decodedToken = token => jwt.decode(token);

exports.albumMapper = ({ id, title }, userId) => ({
  id,
  title,
  userId
});

exports.externalMockAlbum = () =>
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

exports.externalMockPhotos = () =>
  beforeEach(() =>
    nock('https://jsonplaceholder.typicode.com')
      .get('/photos')
      .query({ albumId: '1' })
      .reply(200, [
        {
          albumId: 1,
          id: 1,
          title: 'accusamus beatae ad facilis cum similique qui sunt',
          url: 'https://via.placeholder.com/600/92c952',
          thumbnailUrl: 'https://via.placeholder.com/150/92c952'
        },
        {
          albumId: 1,
          id: 2,
          title: 'reprehenderit est deserunt velit ipsam',
          url: 'https://via.placeholder.com/600/771796',
          thumbnailUrl: 'https://via.placeholder.com/150/771796'
        }
      ])
  );
