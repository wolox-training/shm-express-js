const albumsService = require('../services/albums');
const logger = require('../logger');
const message = require('../constants');
// const errors = require('../errors');

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
  const params = {
    albumId: req.params.id
  };
  // if (params.albumId > 100 || isNaN(params.albumId)) {
  //   return next(errors.invalidParameters('Please enter a valid ID'));
  // }
  logger.info(`${message.PREVIOUS_MESSAGE} to list of images of an album by the id: ${params.albumId}`);
  return albumsService
    .getPhotosBy(params)
    .then(response => {
      const albumImgUrl = response.map(({ url }) => url);
      logger.info(message.MESSAGE_OK);
      return res.status(200).send(albumImgUrl);
    })
    .catch(next);
};
