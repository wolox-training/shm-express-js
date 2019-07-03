const albumsService = require('../services/albums');
const logger = require('../logger');
const message = require('../constants');
const validations = require('../util');
const { User } = require('../models');
const { Album } = require('../models');

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
    .then(response => {
      const album = {
        id: response[0].id,
        title: response[0].title,
        userId: user.id
      };
      albumsService.albumRegister(album).then(() =>
        User.findAll({
          include: [Album],
          raw: true
        }).then(users => {
          console.log(users);
        })
      );
      return res.status(200).send(response);
    })
    .catch(next);
};
