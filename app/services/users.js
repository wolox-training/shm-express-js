const { User } = require('../models');
const errors = require('../errors');
const logger = require('../logger');
const { passwordEncryption, passwordDecryption, generateToken } = require('../utils');

exports.userRegister = user =>
  exports
    .findUserBy({ email: user.email })
    .then(foundUser => {
      if (foundUser) {
        throw errors.badRequest('The email is already registered.');
      }
      return passwordEncryption(user);
    })
    .then(userToCreate =>
      User.create(userToCreate).catch(() => {
        throw errors.databaseError('Error processing request in database.');
      })
    )
    .catch(error => {
      logger.error(`Error trying to create the user ${user.firstName} ${user.lastName}`);
      throw error;
    });

exports.findUserBy = option =>
  User.findOne({
    where: option,
    attributes: ['id', 'firstName', 'lastName', 'email', 'password', 'role']
  }).catch(() => {
    logger.error('Error trying to find the user');
    throw errors.databaseError('Error processing request in database.');
  });

exports.signIn = (email, password) =>
  exports
    .findUserBy(email)
    .then(foundUser => {
      if (foundUser) {
        return passwordDecryption(password, foundUser.password).then(registered =>
          registered ? generateToken(foundUser) : null
        );
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
    logger.error('Error trying to find the users');
    throw errors.databaseError('Error processing request in database.');
  });

exports.changeRole = (role, email) =>
  User.update(
    { role },
    {
      where: { email }
    }
  ).catch(() => {
    logger.error('Error trying to update the user');
    throw errors.databaseError('Error processing request in database.');
  });

exports.findUser = email =>
  User.findOne({
    where: { email },
    raw: true,
    attributes: ['id', 'firstName', 'lastName', 'email', 'password', 'role']
  }).catch(err => {
    logger.info('Error trying to find the user');
    throw errors.databaseError(`${err}`);
  });

exports.findAllUser = (limit, offset) =>
  User.findAndCountAll({
    limit,
    offset,
    raw: true,
    attributes: ['id', 'firstName', 'lastName', 'email']
  }).catch(err => {
    logger.info('Error trying to find the user');
    throw errors.databaseError(`${err}`);
  });

exports.AdminUserRegister = user =>
  User.create({ ...user, role: 'admin' }).catch(() => {
    logger.info(`Error trying to create the user ${user.firstName} ${user.lastName}`);
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
