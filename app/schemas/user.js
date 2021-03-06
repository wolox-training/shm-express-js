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

exports.signInValidator = {
  email: {
    errorMessage: 'Please enter a valid email address',
    isEmail: true,
    trim: true,
    matches: {
      errorMessage: 'The email does not belong to the Wolox domains',
      options: [/^[a-z0-9._-]+@wolox.(co|cl|com|ar|com.ar)+$/i]
    }
  }
};
