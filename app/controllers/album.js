const { getAlbums, getPhotosBy, albumRegister, findAlbumBy } = require('../services/albums');
const logger = require('../logger');
const message = require('../constants');
const { decodedToken } = require('../utils');
const { albumMapper } = require('../mappers/mappers');
const errors = require('../errors');

exports.getAllAlbums = (req, res, next) => {
  logger.info(`${message.PREVIOUS_MESSAGE} to list of albums`);
  return getAlbums()
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
  return getPhotosBy(params)
    .then(response => {
      const albumImgUrl = response.map(({ url }) => url);
      logger.info(message.MESSAGE_OK);
      return res.status(200).send(albumImgUrl);
    })
    .catch(next);
};

exports.buyAlbums = (req, res, next) => {
  const qs = {
    id: req.params.id
  };
  logger.info(`buyAlbums method start, request methods: ${req.method}, endpoint: ${req.path}, id: ${qs.id}`);
  findAlbumBy(qs)
    .then(purchasedAlbum => {
      if (purchasedAlbum) {
        return next(errors.buyAlbumError('Duplicate purchase of an album is not allowed'));
      }
      const user = decodedToken(req.headers.token);
      return getAlbums(qs).then(([{ id, title }]) => {
        albumRegister(albumMapper(id, title, user.id)).then(() => {
          logger.info(`Album ${title} successfully purchased`);
          res.status(201).send({
            album: {
              id,
              title
            }
          });
        });
      });
    })
    .catch(next);
};
