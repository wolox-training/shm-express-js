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

exports.externalMock = () =>
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
