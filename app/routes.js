const paginate = require('express-paginate');

const { healthCheck } = require('./controllers/healthCheck');
const { getAlbums, getPhotos, buyAlbums, getAlbumsList, getAlbumPhotosList } = require('./controllers/album');
const { createUser, signInUser, getUserList, createAdminUser } = require('../app/controllers/user');
const { checkValidationSchema } = require('./middlewares/checkSchema');
const {
  signUpValidator,
  signInValidator,
  tokenValidator,
  signUpAdminUserValidator
} = require('./schemas/user');
const { albumByIdValidator } = require('./schemas/album');
const { isAdminUser, allowList } = require('./middlewares/sessionValidator');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
  app.get('/albums/:id/photos', checkValidationSchema(albumByIdValidator), getPhotos);
  app.post('/users', checkValidationSchema(signUpValidator), createUser);
  app.post('/users/sessions', checkValidationSchema(signInValidator), signInUser);
  app.get('/users', checkValidationSchema(tokenValidator), paginate.middleware(4, 10), getUserList);
  app.post(
    '/admin/users',
    checkValidationSchema(tokenValidator),
    checkValidationSchema(signUpAdminUserValidator),
    isAdminUser,
    createAdminUser
  );
  app.post('/albums/:id', checkValidationSchema(tokenValidator), buyAlbums);
  app.get('/users/:user_id/albums', checkValidationSchema(tokenValidator), allowList, getAlbumsList);
  app.get('/users/albums/:id/photos', checkValidationSchema(tokenValidator), getAlbumPhotosList);
};
