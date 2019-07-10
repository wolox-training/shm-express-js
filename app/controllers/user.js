const validations = require('../util');
const { userRegister, findUser, findAllUser, changeRole, updateSecret } = require('../services/users');
const logger = require('../logger');
const errors = require('../errors');
const { expiresIn } = require('../../config').common.session;

exports.createUser = (req, res, next) => {
  logger.info('createUser method start.');
  const user = req.body;
  return validations
    .passwordEncryption(user)
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
  logger.info('SignInUser method start.');
  const { email, password } = req.body;
  return findUser(email)
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
        ? res.status(200).send({ token, Message: `Your token will expire at ${expiresIn}` })
        : res.status(401).send(errors.signUpError('Your email or password is incorrect.'))
    )
    .catch(next);
};

exports.getUserList = (req, res, next) => {
  logger.info('getUserList method start.');
  const { limit, page } = req.query;
  const offset = req.skip;
  return findAllUser(limit, offset)
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
  req.body.role = 'admin';
  return changeRole(req.body.email)
    .then(updated =>
      updated[0]
        ? res.status(201).send({ message: `User ${updated[1][0].firstName} updated to admin` })
        : exports.createUser(req, res, next)
    )
    .catch(next);
};

exports.disableAllSessions = (req, res, next) => {
  logger.info(`disableAllSessions method start, request methods: ${req.method}, endpoint: ${req.path}.`);
  const { email } = validations.decodedToken(req.headers.token);
  updateSecret(email)
    .then(() => {
      res.status(200).send({ message: 'All sessions have been disabled' });
    })
    .catch(next);
};
