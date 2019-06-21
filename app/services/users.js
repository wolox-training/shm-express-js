const { User } = require('../models');
const errors = require('../errors');
const logger = require('../logger');

exports.userRegister = user =>
  User.create(user).catch(() => {
    logger.info(`Error trying to create the user ${user.firstName} ${user.lastName}`);
    throw errors.databaseError('Error processing request in database.');
  });

exports.findUser = email =>
  User.findOne({
    where: { email },
    raw: true,
    attributes: ['id', 'firstName', 'lastName', 'email', 'password']
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
