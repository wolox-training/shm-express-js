const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken-promisified');

const errors = require('./errors');
const { salt_rounds, secret, expiresIn } = require('../config').common.session;

exports.passwordEncryption = user =>
  bcrypt
    .hash(user.password, salt_rounds)
    .then(password => ({
      ...user,
      password
    }))
    .catch(errors.encryptionError());

exports.passwordDecryption = ({ password, hash }) =>
  bcrypt.compare(password, hash).catch(() => {
    throw errors.decryptionError();
  });

exports.generateToken = ({ id, firstName, lastName, email, role }) =>
  jwt.signAsync({ id, firstName, lastName, email, role }, secret, { expiresIn }).catch(() => {
    throw errors.generateTokenError();
  });

exports.validateToken = token => jwt.verifyAsync(token, secret);

exports.decodedToken = token => jwt.decode(token);
