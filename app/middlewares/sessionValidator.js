const { decodedToken } = require('../util');
const errors = require('../errors');

exports.isAdminUser = (req, res, next) => {
  const { role } = decodedToken(req.headers.token);
  return role === 'admin'
    ? next()
    : next(errors.sessionError('Access denied, allowed only for administrator users'));
};

exports.allowList = (req, res, next) => {
  const { id } = decodedToken(req.headers.token);
  const { user_id } = req.params;
  return id === parseInt(user_id) ? next() : exports.isAdminUser(req, res, next);
};
