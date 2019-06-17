const { checkSchema, validationResult } = require('express-validator/check');

const checkvalidationResult = (req, res, next) => {
  const errors = validationResult(req);
  return errors.isEmpty() ? next() : res.status(422).json({ errors: errors.array() });
};

exports.checkUser = schema => [checkSchema(schema), checkvalidationResult];
