const { validateToken, decodedToken } = require('../utils');
const errors = require('../errors');
const { findUserBy } = require('../services/users');

exports.tokenValidator = (req, res, next) => {
  const { token } = req.headers;
  if (token) {
    return validateToken(token)
      .then(() => {
        const { email, iat } = decodedToken(token);
        return findUserBy({ email }, ['allowedDate']).then(({ allowedDate }) => {
          if (iat > allowedDate) {
            return next();
          }
          return next(errors.sessionError('Session error, the token has been disabled'));
        });
      })
      .catch(error => next(errors.sessionError(`Session error, ${error.message}`)));
  }
  return next(errors.sessionError('Session error, the token has not been provided'));
};
