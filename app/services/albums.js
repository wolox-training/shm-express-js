const request = require('request-promise');

const errors = require('../errors');
const apiError = require('../constants');
const { resources } = require('../../config').common;
const { Album } = require('../models');
const logger = require('../logger');

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

exports.albumRegister = album =>
  Album.create(album).catch(() => {
    logger.info(`Error trying to register the album ${album.title}`);
    throw errors.databaseError('Error processing request in database.');
  });
