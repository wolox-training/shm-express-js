const bcrypt = require('bcrypt');

const errors = require('./errors');

exports.paramsValidation = (pass, email) => {
  const regexPass = /^([a-z0-9]){8,}$/i;
  const regexMail = /^[a-z0-9._-]+@wolox.(co|cl|com|ar|com.ar)+$/i;
  if (!regexPass.test(pass) || !regexMail.test(email)) {
    return false;
  }
  return true;
};

exports.passwordEncryption = user =>
  bcrypt
    .hash(user.password, 10)
    .then(password => ({
      ...user,
      password
    }))
    .catch(err =>
      Promise.reject(errors.encryptionError(`Error trying to encrypt the password. ${err.message}`))
    );
