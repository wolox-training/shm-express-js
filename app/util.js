const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

exports.generateToken = ({ id, firstName, lastName, email }) =>
  jwt.sign({ id, firstName, lastName, email }, session.seed);

exports.tokenValidate = token => jwt.verify(token, session.seed);
