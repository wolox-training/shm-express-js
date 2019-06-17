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

exports.INVALID_PARAMETERS_ERROR = 'invalid_parameters_error';
exports.invalidParameters = message => internalError(message, exports.INVALID_PARAMETERS_ERROR);

exports.PASSWORD_ENCRYPTION_ERROR = 'password_encryption_error.';
exports.encryptionError = message => internalError(message, exports.PASSWORD_ENCRYPTION_ERROR);
