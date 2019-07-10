const { passwordEncryption, mapperUserList } = require('../utils');
const { userRegister, signIn, findAllUsers } = require('../services/users');
const logger = require('../logger');

exports.createUser = (req, res, next) => {
  const user = req.body;
  logger.info(
    `CreateUser method start, request methods: ${req.method}, endpoint: ${req.path}, 
    user: ${user.firstName} ${user.lastName}`
  );
  return passwordEncryption(user)
    .then(userRegister)
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
  const { email, password } = req.body;
  logger.info(
    `SignInUser method start, request methods: ${req.method}, endpoint: ${req.path}, email: ${email}`
  );
  return signIn({ email }, password)
    .then(token => res.send({ token }))
    .catch(next);
};

exports.getUsersList = (req, res, next) => {
  const { token } = req.headers;
  logger.info(
    `getUserList method start, request methods: ${req.method}, endpoint: ${req.path}, token: ${token}`
  );
  const { limit, page } = req.query;
  const offset = req.skip;
  return findAllUsers(limit, offset)
    .then(foundUsers => mapperUserList(foundUsers, limit, page))
    .then(response => res.send(response))
    .catch(next);
};
