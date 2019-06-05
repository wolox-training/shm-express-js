const albumsService = require('../services/albums');
const logger = require('../logger');
const message = require('../constants');
const errors = require('../errors');

exports.getAlbums = (req, res, next) => {
  logger.info(`${message.PREVIOUS_MESSAGE} to list of albums`);
  return albumsService
    .getAlbums()
    .then(response => {
      logger.info(message.MESSAGE_OK);
      return res.status(200).send(response);
    })
    .catch(next);
};

exports.getPhotos = (req, res, next) => {
  const idAlbum = req.params.id;
  if (idAlbum > 100 || isNaN(idAlbum)) {
    return next(errors.invalidParameters('Please enter a valid ID'));
  }
  logger.info(`${message.PREVIOUS_MESSAGE} to list of images of an album by the id: ${idAlbum}`);
  return albumsService
    .getPhotosBy(idAlbum)
    .then(response => {
      const albumImgUrl = response.map(({ url }) => url);
      logger.info(message.MESSAGE_OK);
      return res.status(200).send(albumImgUrl);
    })
    .catch(next);
};
