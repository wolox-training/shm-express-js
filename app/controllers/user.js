const utils = require('../utils');
const userService = require('../services/users');
const logger = require('../logger');
const errors = require('../errors');

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
    .findUserBy({ email })
    .then(foundUser => {
      if (foundUser) {
        return utils
          .passwordDecryption(password, foundUser.password)
          .then(registered => (registered ? utils.generateToken(foundUser) : null));
      }
      throw errors.signInError('Your email or password is incorrect.');
    })
    .then(token =>
      token
        ? res.status(200).send({ token })
        : res.status(401).send(errors.signInError('Your email or password is incorrect.'))
    )
    .catch(next);
};
