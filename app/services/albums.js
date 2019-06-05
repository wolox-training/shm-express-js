const request = require('request-promise');

const errors = require('../errors');
const apiError = require('../constants');
const { resources } = require('../../config').common;

exports.getAlbums = () => {
  const options = {
    method: 'GET',
    uri: resources.album_url,
    json: true
  };

  return request(options).catch(err =>
    Promise.reject(errors.albumError(`${apiError.MESSAGE_API_FAILED}. ${err.message}`))
  );
};

exports.getPhotosBy = parameter => {
  const options = {
    method: 'GET',
    uri: resources.photos_url + parameter,
    json: true
  };

  return request(options).catch(err =>
    Promise.reject(errors.albumError(`${apiError.MESSAGE_API_FAILED}. ${err.message}`))
  );
};
