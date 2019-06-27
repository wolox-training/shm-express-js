const { decodedToken } = require('../util');
const errors = require('../errors');

exports.isAdminUser = (req, res, next) => {
  const { role } = decodedToken(req.headers.token);
  return role === 'admin'
    ? next()
    : next(errors.sessionError('Access denied, allowed only for administrator users'));
};
