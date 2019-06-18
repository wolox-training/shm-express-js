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
    .then(async response => {
      logger.info(`User ${response.firstName} ${response.lastName} ${response.lastName} found successfully`);
      const check = await validations.passwordDecryption(password, response.password);
      return { ...response.dataValues, check };
    })
    .then(response => {
      console.log(response);
      return res.status(201).send({
        firstName: response.firstName,
        lastName: response.lastName,
        check: response.check,
        message: 'User has been found successfully'
      });
    })
    .catch(next);
};
