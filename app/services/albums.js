const request = require('request-promise');

const errors = require('../errors');
const { MESSAGE_ALBUM_API_FAILED, DATABASE_ERROR } = require('../constants');
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
  return request(options).catch(() => {
    logger.error('Error trying to consume album API');
    throw errors.albumError(MESSAGE_ALBUM_API_FAILED);
  });
};

exports.getPhotosBy = qs => {
  const options = {
    method: 'GET',
    uri: `${resources.url_album_api}${resources.photos_endpoint}`,
    qs,
    json: true
  };

  return request(options).catch(() => {
    logger.error('Error trying to consume album API');
    throw errors.albumError(MESSAGE_ALBUM_API_FAILED);
  });
};

exports.findAlbumBy = ({ conditions, attributes }) =>
  Album.findOne({
    where: conditions,
    attributes
  }).catch(() => {
    logger.error('Error trying to find the album');
    throw errors.databaseError(DATABASE_ERROR);
  });

exports.albumRegister = album =>
  Album.create(album).catch(() => {
    logger.error(`Error trying to register the album ${album.title}`);
    throw errors.databaseError(DATABASE_ERROR);
  });

exports.findAllAlbumsBy = ({ conditions, attributes }) =>
  Album.findAll({
    where: conditions,
    attributes
  }).catch(() => {
    logger.info("Error trying to get the user's albums");
    throw errors.databaseError(DATABASE_ERROR);
  });

exports.getAlbumPhotos = ({ id, userId }) =>
  exports.findAlbumBy({ conditions: { id, userId }, attributes: ['id'] }).then(foundAlbum => {
    if (!foundAlbum) {
      return [];
    }
    const albumId = foundAlbum.dataValues.id;
    return exports.getPhotosBy({ albumId });
  });
