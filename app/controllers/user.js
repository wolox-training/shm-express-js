const validations = require('../util');
const userService = require('../services/users');
const logger = require('../logger');

exports.createUser = ({ body }, res, next) =>
  validations
    .passwordEncryption(body)
    .then(userService.userRegister)
    .then(response => {
      logger.info(`User ${body.firstName} ${body.lastName} created successfully`);
      return res.status(201).send({
        firstName: response.firstName,
        lastName: response.lastName
      });
    })
    .catch(next);
