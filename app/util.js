const bcrypt = require('bcrypt');

const errors = require('./errors');

exports.passwordEncryption = user =>
  bcrypt
    .hash(user.password, 10)
    .then(password => ({
      ...user,
      password
    }))
    .catch(() => {
      throw errors.encryptionError();
    });
