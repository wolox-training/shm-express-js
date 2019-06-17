const bcrypt = require('bcrypt');

const errors = require('./errors');
const { session } = require('../config').common;

exports.paramsValidation = (pass, email) => {
  const regexPass = /^([a-z0-9]){8,}$/i;
  const regexMail = /^[a-z0-9._-]+@wolox.(co|cl|com|ar|com.ar)+$/i;
  return !regexPass.test(pass) || !regexMail.test(email);
};

exports.passwordEncryption = user =>
  bcrypt
    .hash(user.password, session.salt_rounds)
    .then(password => ({
      ...user,
      password
    }))
    .catch(err => {
      throw errors.encryptionError(`Error trying to encrypt the password. ${err.message}`);
    });
