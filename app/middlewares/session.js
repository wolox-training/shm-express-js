const { validateToken, decodedToken } = require('../utils');
const errors = require('../errors');
const { findUserBy } = require('../services/users');

exports.tokenValidator = (req, res, next) => {
  const { token } = req.headers;
  if (token) {
    const { email } = decodedToken(token);
    return findUserBy({ email }, ['secret']).then(({ secret }) =>
      validateToken(token, secret)
        .then(() => next())
        .catch(error => next(errors.sessionError(`Session error, ${error.message}`)))
    );
  }
  return next(errors.sessionError('Session error, the token has not been provided'));
};
