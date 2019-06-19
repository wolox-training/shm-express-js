const { checkSchema, validationResult } = require('express-validator/check');

const error = require('../errors');

const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  return errors.isEmpty() ? next() : res.status(400).json({ errors: errors.array(), ...error.badRequest() });
};

exports.checkValidationSchema = schema => [checkSchema(schema), checkValidationResult];
