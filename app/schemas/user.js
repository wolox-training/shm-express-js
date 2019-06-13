exports.signUpValidator = {
  first_name: {
    errorMessage: 'First Name should be at least 3 chars long and maximum of 50 chars',
    isLength: {
      options: { min: 3, max: 50 }
    },
    trim: true
  },
  last_name: {
    errorMessage: 'Last Name should be at least 3 chars long and maximum of 50 chars',
    isLength: {
      options: { min: 3, max: 50 }
    },
    trim: true
  },
  email: {
    errorMessage: 'Please enter a valid email address',
    isEmail: true,
    trim: true,
    matches: {
      options: [/^[a-z0-9._-]+@wolox.(co|cl|com|ar|com.ar)+$/i],
      errorMessage: 'The email does not belong to the Wolox domains'
    }
  },
  password: {
    isLength: {
      errorMessage: 'Password should be at least 6 chars long',
      options: { min: 8 }
    },
    matches: {
      options: [/^([a-z0-9])+$/i],
      errorMessage: 'The password must be alphanumeric'
    }
  }
  // confirm_password: {
  //   errorMessage: 'Must have the same value as the password field',
  //   custom: {
  //     options: (value, { req }) => value === req.body.password
  //   }
  // }
};
