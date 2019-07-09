const paginate = require('express-paginate');

const { healthCheck } = require('./controllers/healthCheck');
const { getAlbums, getPhotos } = require('./controllers/album');
const { createUser, signInUser, getUsersList } = require('../app/controllers/user');
const { checkValidationSchema } = require('./middlewares/checkSchema');
const { signUpValidator, signInValidator, tokenValidator } = require('./schemas/user');
const { albumByIdValidator } = require('./schemas/album');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
  app.get('/albums/:id/photos', checkValidationSchema(albumByIdValidator), getPhotos);
  app.post('/users', checkValidationSchema(signUpValidator), createUser);
  app.post('/users/sessions', checkValidationSchema(signInValidator), signInUser);
  app.get('/users', checkValidationSchema(tokenValidator), paginate.middleware(5, 50), getUsersList);
};
