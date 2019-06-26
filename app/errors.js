const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.ALBUM_API_ERROR = 'error_consuming_album_api';
exports.albumError = message => internalError(message, exports.ALBUM_API_ERROR);

exports.BAD_REQUEST = 'bad_request';
exports.badRequest = () => internalError('Invalid request parameters', exports.BAD_REQUEST);

exports.PASSWORD_ENCRYPTION_ERROR = 'password_encryption_error.';
exports.encryptionError = () =>
  internalError('Error trying to encrypt the password.', exports.PASSWORD_ENCRYPTION_ERROR);

exports.PASSWORD_DECRYPTION_ERROR = 'password_decryption_error.';
exports.decryptionError = () =>
  internalError('Error trying to decrypt the password.', exports.PASSWORD_DECRYPTION_ERROR);

exports.SIGN_UP_ERROR = 'sign_up_error';
exports.signUpError = message => internalError(message, exports.SIGN_UP_ERROR);

exports.GENERATE_TOKEN_ERROR = 'generate_token_error.';
exports.generateTokenError = () =>
  internalError('Error trying to generate the token.', exports.GENERATE_TOKEN_ERROR);
