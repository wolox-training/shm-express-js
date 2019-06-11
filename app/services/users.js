const { users } = require('../models');
const errors = require('../errors');
const logger = require('../logger');

exports.userRegister = user =>
  users.create(user).catch(err => {
    logger.info(`Error trying to create the user ${user.firstName} ${user.lastName}`);
    return Promise.reject(errors.databaseError(`${err.errors[0].message}`));
  });
