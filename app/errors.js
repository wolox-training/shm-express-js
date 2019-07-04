const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DATABASE_ERROR = 'database_error';

exports.DEFAULT_ERROR = 'default_error';

exports.ALBUM_API_ERROR = 'error_consuming_album_api';

exports.BAD_REQUEST = 'bad_request';

exports.PASSWORD_ENCRYPTION_ERROR = 'password_encryption_error.';

exports.PASSWORD_DECRYPTION_ERROR = 'password_decryption_error.';

exports.SIGN_IN_ERROR = 'sign_up_error';

exports.GENERATE_TOKEN_ERROR = 'generate_token_error.';

exports.VERIFY_TOKEN_ERROR = 'verify_token_error.';

exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.albumError = message => internalError(message, exports.ALBUM_API_ERROR);

exports.badRequest = message => internalError(message, exports.BAD_REQUEST);

exports.encryptionError = () =>
  internalError('Error trying to encrypt the password.', exports.PASSWORD_ENCRYPTION_ERROR);

exports.decryptionError = () =>
  internalError('Error trying to decrypt the password.', exports.PASSWORD_DECRYPTION_ERROR);

exports.signInError = message => internalError(message, exports.SIGN_IN_ERROR);

exports.generateTokenError = () =>
  internalError('Error trying to generate the token.', exports.GENERATE_TOKEN_ERROR);

exports.verifyTokenError = () =>
  internalError('Error trying to verify the token.', exports.VERIFY_TOKEN_ERROR);
