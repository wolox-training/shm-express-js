const validations = require('../util');
const userService = require('../services/users');
const logger = require('../logger');

exports.createUser = (req, res, next) => {
  const user = req.body;
  return validations
    .passwordEncryption(user)
    .then(userService.userRegister)
    .then(response => {
      logger.info(`User ${user.firstName} ${user.lastName} created successfully`);
      return res.status(201).send({
        firstName: user.firstName,
        lastName: user.lastName,
        message: `User has been created successfully with ID ${response.id}`
      });
    })
    .catch(next);
};

exports.signInUser = (req, res, next) => {
  const { email, password } = req.body;
  return userService
    .findUser(email)
    .then(response => (response ? validations.passwordDecryption(response, password) : false))
    .then(response =>
      response
        ? res.status(201).send({ ...response, email, token: '123' })
        : res.status(500).send({ message: 'Incorrect username or password' })
    )
    .catch(next);
};
