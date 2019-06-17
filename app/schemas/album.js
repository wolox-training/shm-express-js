exports.albumByIdValidator = {
  id: {
    in: ['params'],
    toInt: true,
    isLength: { options: { min: 1, max: 100 } },
    errorMessage: 'Please enter a valid ID.'
  }
};
