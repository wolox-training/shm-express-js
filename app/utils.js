const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken-promisified');

const errors = require('./errors');
const { salt_rounds, expiresIn } = require('../config').common.session;

exports.passwordEncryption = user =>
  bcrypt
    .hash(user.password, salt_rounds)
    .then(password => ({
      ...user,
      password
    }))
    .catch(errors.encryptionError());

exports.passwordDecryption = (password, hash) =>
  bcrypt.compare(password, hash).catch(() => {
    throw errors.decryptionError();
  });

exports.generateToken = ({ id, firstName, lastName, email, role, secret }) =>
  jwt.signAsync({ id, firstName, lastName, email, role }, secret, { expiresIn }).catch(() => {
    throw errors.generateTokenError();
  });

exports.validateToken = (token, secret) => jwt.verifyAsync(token, secret);

exports.decodedToken = token => jwt.decode(token);

exports.generateSecret = () =>
  Math.random()
    .toString(36)
    .replace('0.', '');
