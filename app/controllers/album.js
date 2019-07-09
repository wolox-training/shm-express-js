const albumsService = require('../services/albums');
const logger = require('../logger');
const message = require('../constants');
const validations = require('../util');

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

exports.buyAlbums = (req, res, next) => {
  const user = validations.decodedToken(req.headers.token);
  const qs = {
    id: req.params.id
  };
  return albumsService
    .getAlbums(qs)
    .then(response =>
      albumsService.albumRegister(validations.albumMapper(response[0], user.id)).then(({ dataValues }) => {
        logger.info(`Album ${dataValues.title} successfully purchased`);
        res.status(201).send({
          album: {
            id: dataValues.id,
            title: dataValues.title
          }
        });
      })
    )
    .catch(next);
};

exports.getAlbumsList = (req, res, next) => {
  logger.info('getAlbumsList method start.');
  const attributes = ['id', 'title'];
  albumsService
    .findAllAlbums(req.params, attributes)
    .then(response => {
      res.send({ albums: response });
    })
    .catch(next);
};

exports.getAlbumPhotosList = (req, res, next) => {
  logger.info('getAlbumPhotosList method start.');
  const user = validations.decodedToken(req.headers.token);
  const { id } = req.params;
  return albumsService
    .getAlbumPhotos(id, user.id)
    .then(response => res.send({ albumPhotos: response }))
    .catch(next);
};
