const { User } = require('../models');
const validations = require('../util');

exports.signUpValidator = {
  firstName: {
    isLength: {
      errorMessage: 'First Name should be at least 2 chars long and maximum of 50 chars',
      options: { min: 2, max: 50 }
    },
    trim: true
  },
  lastName: {
    isLength: {
      errorMessage: 'Last Name should be at least 2 chars long and maximum of 50 chars',
      options: { min: 2, max: 50 }
    },
    trim: true
  },
  email: {
    errorMessage: 'Please enter a valid email address',
    isEmail: true,
    trim: true,
    custom: {
      options: value => User.findOne({ where: { email: value } }).then(response => !response),
      errorMessage: 'The email is already registered'
    },
    matches: {
      errorMessage: 'The email does not belong to the Wolox domains',
      options: [/^[a-z0-9._-]+@wolox.(co|cl|com|ar|com.ar)+$/i]
    }
  },
  password: {
    isLength: {
      errorMessage: 'Password should be at least 8 chars long',
      options: { min: 8 }
    },
    matches: {
      options: [/^([a-z0-9])+$/i],
      errorMessage: 'The password must be alphanumeric'
    }
  },
  confirm_password: {
    errorMessage: 'Must have the same value as the password field',
    custom: {
      options: (value, { req }) => value === req.body.password
    }
  }
};

exports.signInValidator = {
  email: {
    errorMessage: 'Please enter a valid email address',
    isEmail: true,
    trim: true,
    custom: {
      options: value => User.findOne({ where: { email: value } }).then(response => response),
      errorMessage: 'Unregistered user'
    },
    matches: {
      errorMessage: 'The email does not belong to the Wolox domains',
      options: [/^[a-z0-9._-]+@wolox.(co|cl|com|ar|com.ar)+$/i]
    }
  }
};

exports.tokenValidator = {
  token: {
    custom: {
      options: value => validations.tokenValidate(value),
      errorMessage: 'Invalid token'
    }
  }
};

exports.signUpAdminUserValidator = {
  firstName: {
    isLength: {
      errorMessage: 'First Name should be at least 2 chars long and maximum of 50 chars',
      options: { min: 2, max: 50 }
    },
    trim: true
  },
  lastName: {
    isLength: {
      errorMessage: 'Last Name should be at least 2 chars long and maximum of 50 chars',
      options: { min: 2, max: 50 }
    },
    trim: true
  },
  email: {
    errorMessage: 'Please enter a valid email address',
    isEmail: true,
    trim: true,
    custom: {
      options: value => User.findOne({ where: { email: value } }).then(response => !response),
      errorMessage: 'The email is already registered'
    },
    matches: {
      errorMessage: 'The email does not belong to the Wolox domains',
      options: [/^[a-z0-9._-]+@wolox.(co|cl|com|ar|com.ar)+$/i]
    }
  },
  password: {
    isLength: {
      errorMessage: 'Password should be at least 8 chars long',
      options: { min: 8 }
    },
    matches: {
      options: [/^([a-z0-9])+$/i],
      errorMessage: 'The password must be alphanumeric'
    }
  }
};
