const { healthCheck } = require('./controllers/healthCheck');
const { getAlbums, getPhotos } = require('./controllers/album');
const { createUser } = require('../app/controllers/user');
const { checkValidationSchema } = require('./middlewares/checkSchema');
const { signUpValidator } = require('./schemas/user');
const { albumByIdValidator } = require('./schemas/album');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
  app.get('/albums/:id/photos', checkValidationSchema(albumByIdValidator), getPhotos);
  app.post('/users', checkValidationSchema(signUpValidator), createUser);
};
