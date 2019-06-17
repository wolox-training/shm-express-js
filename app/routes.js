const { healthCheck } = require('./controllers/healthCheck');
const { getAlbums, getPhotos } = require('./controllers/album');
const { createUser } = require('../app/controllers/user');
const { checkUser } = require('./middlewares/users');
const { checkAlbumId } = require('./middlewares/albums');
const { signUpValidator } = require('./schemas/user');
const { albumByIdValidator } = require('./schemas/album');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
  app.get('/albums/:id/photos', checkAlbumId(albumByIdValidator), getPhotos);
  app.post('/users', checkUser(signUpValidator), createUser);
};
