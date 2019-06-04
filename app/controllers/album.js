const albumsService = require('../services/albums'),
  logger = require('../logger'),
  message = require('../constants');

exports.getAlbumsInventory = (req, res, next) => {
  logger.info(`${message.PREVIOUS_MESSAGE} to list of albums`);
  albumsService
    .getAlbums()
    .then(response => {
      logger.info(message.MESSAGE_OK);
      res.status(200).send(response);
    })
    .catch(next);
};

exports.getPhotos = (req, res, next) => {
  const idAlbum = req.params.id;
  if (idAlbum > 100 || isNaN(idAlbum)) {
    throw Error('Make sure your request is correct');
  }
  logger.info(`${message.PREVIOUS_MESSAGE} to list of images of an album by the id: ${idAlbum}`);
  albumsService
    .getPhotosById(idAlbum)
    .then(response => {
      const AlbumImgUrl = response.map(({ url }) => url);
      logger.info(message.MESSAGE_OK);
      res.status(200).send(AlbumImgUrl);
    })
    .catch(next);
};
