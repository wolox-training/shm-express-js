const { passwordEncryption, mapperUserList } = require('../utils');
const userService = require('../services/users');
const logger = require('../logger');

exports.createUser = (req, res, next) => {
  logger.info(`request methods: ${req.method}, endpoint: ${req.path}, createUser method start.`);
  const user = req.body;
  return passwordEncryption(user)
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
  logger.info(`request methods: ${req.method}, endpoint: ${req.path}, SignInUser method start.`);
  const { email, password } = req.body;
  return userService
    .signIn({ email }, password)
    .then(token => res.send({ token }))
    .catch(next);
};

exports.getUserList = (req, res, next) => {
  logger.info(`request methods: ${req.method}, endpoint: ${req.path}, getUserList method start.`);
  const { limit, page } = req.query;
  const offset = req.skip;
  return userService
    .findAllUsers(limit, offset)
    .then(foundUsers => mapperUserList(foundUsers, limit, page))
    .then(response => res.send(response))
    .catch(next);
};
