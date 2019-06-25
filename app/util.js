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
    .catch(err => {
      throw errors.encryptionError(`${err.message}`);
    });
