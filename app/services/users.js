const { User } = require('../models');
const errors = require('../errors');
const logger = require('../logger');
const utils = require('../utils');

exports.userRegister = user =>
  User.create(user).catch(() => {
    logger.info(`Error trying to create the user ${user.firstName} ${user.lastName}`);
    throw errors.databaseError('Error processing request in database.');
  });

exports.findUserBy = option =>
  User.findOne({
    where: option,
    attributes: ['id', 'firstName', 'lastName', 'email', 'password', 'role']
  }).catch(err => {
    logger.info('Error trying to find the user');
    throw errors.databaseError(`${err}`);
  });

exports.signIn = (email, password) =>
  exports
    .findUserBy(email)
    .then(foundUser => {
      if (foundUser) {
        return utils
          .passwordDecryption(password, foundUser.password)
          .then(registered => (registered ? utils.generateToken(foundUser) : null));
      }
      throw errors.sessionError('Your email or password is incorrect.');
    })
    .then(token => {
      if (token) {
        return token;
      }
      throw errors.sessionError('Your email or password is incorrect.');
    });

exports.findAllUsers = (limit, offset) =>
  User.findAndCountAll({
    limit,
    offset,
    attributes: ['id', 'firstName', 'lastName', 'email', 'role']
  }).catch(() => {
    logger.info('Error trying to find the users');
    throw errors.databaseError('Error processing request in database.');
  });

exports.changeRole = email =>
  User.update(
    { role: 'admin' },
    {
      where: { email },
      raw: true,
      returning: true
    }
  ).catch(() => {
    logger.info('Error trying to update the user');
    throw errors.databaseError('Error processing request in database.');
  });
