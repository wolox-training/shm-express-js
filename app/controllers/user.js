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
  let user = {};
  return userService
    .findUser(email)
    .then(foundUser => {
      user = foundUser;
      return validations.passwordDecryption(password, foundUser.password);
    })
    .then(registered => (registered ? validations.generateToken(user) : null))
    .then(token =>
      token
        ? res.status(200).send({ token })
        : res.status(401).send(errors.signUpError('Your password is incorrect.'))
    )
    .catch(next);
};

exports.getUserList = (req, res, next) => {
  logger.info('getUserList method start.');
  const { limit, page } = req.query;
  const offset = req.skip;
  return userService
    .findAllUser(limit, offset)
    .then(response => {
      const itemCount = response.count;
      const pageCount = Math.ceil(response.count / limit);
      res.status(200).send({
        users: response.rows,
        pageCount,
        itemCount,
        page
      });
    })
    .catch(next);
};

exports.createAdminUser = (req, res, next) => {
  logger.info('createAdminUser method start.');
  req.body = { role: 'admin' };
  const user = req.body;
  return validations
    .passwordEncryption(user)
    .then(userService.changeRole(user.email))
    .then(response => {
      logger.info(`User ${user.firstName} ${user.lastName} created successfully`);
      return res.status(201).send({
        firstName: response.firstName,
        lastName: response.lastName
      });
    })
    .catch(next);
};
