exports.albumByIdValidator = {
  id: {
    in: ['params'],
    isInt: { options: { min: 1, max: 100 } },
    errorMessage: 'The id must be numeric and must be between 1 and 100.'
  }
};

exports.userByIdValidator = {
  user_id: {
    in: ['params'],
    isInt: true,
    errorMessage: 'The userId must be numeric.'
  }
};
