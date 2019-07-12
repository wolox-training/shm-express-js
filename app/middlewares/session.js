const utils = require('../utils');
const errors = require('../errors');

exports.tokenValidator = (req, res, next) => {
  const { token } = req.headers;
  if (token) {
    return utils
      .validateToken(token)
      .then(() => next())
      .catch(error => next(errors.sessionError(`Session error, ${error.message}`)));
  }
  return next(errors.sessionError('Session error, the token has not been provided'));
};
