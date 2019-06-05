const request = require('request-promise');

const errors = require('../errors');
const apiError = require('../constants');
const { resources } = require('../../config').common;

exports.getAlbums = () => {
  const options = {
    method: 'GET',
    uri: `${resources.url_album_api}${resources.albums_endpoint}`,
    json: true
  };
  return request(options).catch(err =>
    Promise.reject(errors.albumError(`${apiError.MESSAGE_API_FAILED}. ${err.message}`))
  );
};

exports.getPhotosBy = (parameterName, parameter) => {
  const options = {
    method: 'GET',
    uri: `${resources.url_album_api}${resources.photos_endpoint}`,
    qs: {
      [parameterName]: parameter
    },
    json: true
  };

  return request(options).catch(err =>
    Promise.reject(errors.albumError(`${apiError.MESSAGE_API_FAILED}. ${err.message}`))
  );
};
