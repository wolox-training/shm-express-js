const bcrypt = require('bcrypt');

const errors = require('../errors');

exports.createUser = (req, res, next) => {
  const regexPass = /^([a-z0-9]){8,}$/i;
  const regexMail = /^[a-z0-9._-]+@wolox.(co|cl|com|com.ar)+$/i;
  if (!regexPass.test(req.body.password) || !regexMail.test(req.body.email)) {
    return next(errors.invalidParameters('Mail does not belong to the wolox domains'));
  }
  const hash = bcrypt.hashSync(req.body.password, 10);
  return res.status(200).send({
    user: {
      name: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash
    }
  });
};
