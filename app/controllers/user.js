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
