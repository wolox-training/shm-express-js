const { users } = require('../models');
const errors = require('../errors');
const logger = require('../logger');

exports.userRegister = user =>
  users.create(user).catch(err => {
    logger.info(`Error trying to create the user ${user.firstName} ${user.lastName}`);
    return Promise.reject(errors.databaseError(`${err.errors[0].message}`));
  });

exports.findUser = email =>
  users.findOne({ where: { email } }).catch(err => {
    logger.info('Error trying to find the user');
    throw errors.databaseError(`${err}`);
  });
