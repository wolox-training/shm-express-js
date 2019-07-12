const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken-promisified');

const errors = require('./errors');
const { session } = require('../config').common;

exports.passwordEncryption = user =>
  bcrypt
    .hash(user.password, session.salt_rounds)
    .then(password => ({
      ...user,
      password
    }))
    .catch(errors.encryptionError());

exports.passwordDecryption = (password, hash) =>
  bcrypt.compare(password, hash).catch(() => {
    throw errors.decryptionError();
  });

exports.generateToken = ({ id, firstName, lastName, email, role }) =>
  jwt.signAsync({ id, firstName, lastName, email, role }, session.secret).catch(() => {
    throw errors.generateTokenError();
  });

exports.validateToken = token => jwt.verifyAsync(token, session.secret);

exports.mapperUserList = ({ count, rows }, limit, page) => {
  const itemCount = count;
  const pageCount = Math.ceil(count / limit);
  return {
    users: rows,
    pageCount,
    itemCount,
    page
  };
};
