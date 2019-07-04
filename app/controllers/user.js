const validations = require('../util');
const userService = require('../services/users');
const logger = require('../logger');
const errors = require('../errors');

exports.createUser = (req, res, next) => {
  logger.info('createUser method start.');
  const user = req.body;
  return validations
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
    .findUser(email)
    .then(foundUser => {
      if (foundUser) {
        return validations
          .passwordDecryption(password, foundUser.password)
          .then(registered => (registered ? validations.generateToken(foundUser) : null));
      }
      return null;
    })
    .then(token =>
      token
        ? res.status(200).send({ token })
        : res.status(401).send(errors.signUpError('Your email or password is incorrect.'))
    )
    .catch(next);
};

exports.getUserList = (req, res, next) => {
  logger.info('getUserList method start.');
  const { limit, page } = req.query;
  const offset = req.skip;
  return userService
    .findAllUser(limit, offset)
    .then(foundUsers => validations.mapperUserList(foundUsers, limit, page))
    .then(response => res.status(200).send(response))
    .catch(next);
};
