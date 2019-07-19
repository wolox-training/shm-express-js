const { checkSchema, validationResult } = require('express-validator/check');

const error = require('../errors');

const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  return errors.isEmpty() ? next() : next(error.badRequest(errors.array().map(err => err.msg)));
};

exports.checkValidationSchema = schema => [checkSchema(schema), checkValidationResult];
