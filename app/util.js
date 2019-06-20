const bcrypt = require('bcrypt');

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

exports.passwordDecryption = (user, password) =>
  bcrypt
    .compare(password, user.password)
    .then(registered => ({
      firstName: user.dataValues.firstName,
      lastName: user.dataValues.lastName,
      email: user.dataValues.email,
      registered
    }))
    .catch(() => {
      throw errors.decryptionError();
    });
