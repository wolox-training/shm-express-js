const utils = require('../utils');
const userService = require('../services/users');
const logger = require('../logger');

exports.createUser = (req, res, next) => {
  logger.info('createUser method start.');
  const user = req.body;
  return utils
    .passwordEncryption(user)
    .then(userService.userRegister)
    .then(response => {
      logger.info(`User ${user.firstName} ${user.lastName} created successfully`);
      return res.status(201).send({
        firstName: response.firstName,
        lastName: response.lastName
      });
    })
    .catch(next);
};

exports.signInUser = (req, res, next) => {
  logger.info('SignInUser method start.');
  const { email, password } = req.body;
  return userService
    .signIn({ email }, password)
    .then(token => res.status(200).send({ token }))
    .catch(next);
};
