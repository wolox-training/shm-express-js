const validations = require('../util');
const userService = require('../services/users');
const errors = require('../errors');
const logger = require('../logger');

exports.createUser = (req, res, next) => {
  const { password, email } = req.body;
  if (validations.paramsValidation(password, email)) {
    return next(errors.invalidParameters('The email or password does not meet the conditions.'));
  }
  return validations
    .passwordEncryption(req.body)
    .then(userService.userRegister)
    .then(response => {
      logger.info(`User ${response.firstName} ${response.lastName} created successfully`);
      return res.status(201).send({
        firstName: response.firstName,
        lastName: response.lastName
      });
    })
    .catch(next);
};
