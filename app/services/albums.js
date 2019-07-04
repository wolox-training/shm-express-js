const request = require('request-promise');

const errors = require('../errors');
const message = require('../constants');
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
  return request(options).catch(err => {
    throw errors.albumError(`${message.MESSAGE_ALBUM_API_FAILED}. ${err.message}`);
  });
};

exports.getPhotosBy = qs => {
  const options = {
    method: 'GET',
    uri: `${resources.url_album_api}${resources.photos_endpoint}`,
    qs,
    json: true
  };

  return request(options).catch(err => {
    throw errors.albumError(`${message.MESSAGE_ALBUM_API_FAILED}. ${err.message}`);
  });
};

exports.albumRegister = album =>
  Album.create(album).catch(err => {
    logger.info(`Error trying to register the album ${album.title}`);
    if (err.name === message.BUY_ALBUM_CONSTRAINT_ERROR) {
      throw errors.buyAlbumError('Duplicate purchase of an album is not allowed');
    }
    throw errors.databaseError('Error processing request in database.');
  });
