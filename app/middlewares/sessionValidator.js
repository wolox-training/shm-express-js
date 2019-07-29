const { decodedToken } = require('../utils');
const errors = require('../errors');
const { ADMIN_ROLE } = require('../constants');

exports.isAdminUser = (req, res, next) => {
  const { role } = decodedToken(req.headers.token);
  return role === ADMIN_ROLE
    ? next()
    : next(errors.sessionError('Access denied, allowed only for administrator users'));
};

exports.allowList = (req, res, next) => {
  const { id } = decodedToken(req.headers.token);
  const { userId } = req.params;
  return id === parseInt(userId) ? next() : exports.isAdminUser(req, res, next);
};
