const { checkSchema, validationResult } = require('express-validator/check');

const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  return errors.isEmpty() ? next() : res.status(422).json({ errors: errors.array() });
};

exports.checkValidationSchema = schema => [checkSchema(schema), checkValidationResult];
