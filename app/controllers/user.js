const { mapperUserList } = require('../mappers/users');
const {
  userRegister,
  signIn,
  findAllUsers,
  changeRole,
  findUserBy,
  updateAllowedDate
} = require('../services/users');
const logger = require('../logger');
const { ADMIN_ROLE, REGULAR_ROLE } = require('../constants');
const errors = require('../errors');
const { decodedToken } = require('../utils');

exports.createUser = (req, res, next) => {
  const user = req.body;
  logger.info(
    `CreateUser method start, request methods: ${req.method}, endpoint: ${req.path}, 
    user: ${user.firstName} ${user.lastName}`
  );
  return userRegister(user)
    .then(({ firstName, lastName }) => {
      logger.info(`User ${firstName} ${lastName} created successfully`);
      return res.status(201).send({
        firstName,
        lastName
      });
    })
    .catch(next);
};

exports.signInUser = (req, res, next) => {
  const { email, password } = req.body;
  logger.info(
    `SignInUser method start, request methods: ${req.method}, endpoint: ${req.path}, email: ${email}`
  );
  return signIn({ email, password })
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
  return findAllUsers({ limit, offset })
    .then(foundUsers => mapperUserList(foundUsers, limit, page))
    .then(response => res.send(response))
    .catch(next);
};

exports.createAdminUser = (req, res, next) => {
  const user = req.body;
  const { email } = user;
  user.role = ADMIN_ROLE;
  logger.info(`createAdminUser method start, request methods: ${req.method}, endpoint: ${req.path},
  user: ${user.firstName} ${user.lastName}`);
  findUserBy({
    conditions: { email },
    attributes: ['id', 'firstName', 'lastName', 'email', 'password', 'role']
  })
    .then(foundUser => {
      if (foundUser) {
        if (foundUser.role === REGULAR_ROLE) {
          return changeRole({ role: ADMIN_ROLE, email }).then(() =>
            res.status(201).send({ message: `User ${email} updated to admin` })
          );
        }
        return next(errors.badRequest('The email is already registered for admin user.'));
      }
      return userRegister(user).then(({ firstName, lastName }) => {
        logger.info(`Admin user ${firstName} ${lastName} created successfully`);
        res.status(201).send({
          firstName,
          lastName
        });
      });
    })
    .catch(next);
};

exports.disableAllSessions = (req, res, next) => {
  logger.info(`disableAllSessions method start, request methods: ${req.method}, endpoint: ${req.path}.`);
  const { email } = decodedToken(req.headers.token);
  return updateAllowedDate(email)
    .then(() => {
      logger.info(`All sessions for the user ${email} have been disabled successfully`);
      return res.send({ message: 'All sessions have been disabled' });
    })
    .catch(next);
};
