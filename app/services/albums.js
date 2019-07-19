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
  return request(options).catch(error => {
    throw errors.albumError(`${message.MESSAGE_ALBUM_API_FAILED}. ${error.message}`);
  });
};

exports.getPhotosBy = qs => {
  const options = {
    method: 'GET',
    uri: `${resources.url_album_api}${resources.photos_endpoint}`,
    qs,
    json: true
  };

  return request(options).catch(error => {
    throw errors.albumError(`${message.MESSAGE_ALBUM_API_FAILED}. ${error.message}`);
  });
};

exports.findAlbumBy = option =>
  Album.findOne({
    where: option,
    attributes: ['id', 'title', 'user_id']
  }).catch(() => {
    logger.error('Error trying to find the album');
    throw errors.databaseError('Error processing request in database.');
  });

exports.albumRegister = album =>
  Album.create(album).catch(() => {
    logger.error(`Error trying to register the album ${album.title}`);
    throw errors.databaseError('Error processing request in database.');
  });

exports.findAllAlbums = userId =>
  Album.findAll({
    where: { userId },
    attributes: ['id', 'title']
  }).catch(() => {
    logger.info(`Error trying to get the user's albums ${userId}`);
    throw errors.databaseError('Error processing request in database.');
  });
