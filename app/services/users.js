const { User } = require('../models');
const errors = require('../errors');
const logger = require('../logger');

exports.userRegister = user =>
  User.create(user).catch(() => {
    logger.info(`Error trying to create the user ${user.firstName} ${user.lastName}`);
    throw errors.databaseError('Error processing request in database.');
  });
