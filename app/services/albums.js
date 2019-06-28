const request = require('request-promise');

const errors = require('../errors');
const apiError = require('../constants');
const { resources } = require('../../config').common;

exports.getAlbums = qs => {
  const options = {
    method: 'GET',
    uri: `${resources.url_album_api}${resources.albums_endpoint}`,
    qs,
    json: true
  };
  return request(options).catch(err =>
    Promise.reject(errors.albumError(`${apiError.MESSAGE_API_FAILED}. ${err.message}`))
  );
};

exports.getPhotosBy = qs => {
  const options = {
    method: 'GET',
    uri: `${resources.url_album_api}${resources.photos_endpoint}`,
    qs,
    json: true
  };

  return request(options).catch(err =>
    Promise.reject(errors.albumError(`${apiError.MESSAGE_API_FAILED}. ${err.message}`))
  );
};
