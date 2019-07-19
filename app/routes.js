const paginate = require('express-paginate');

const { healthCheck } = require('./controllers/healthCheck');
const { getAllAlbums, getPhotos, buyAlbums, getAlbumsList } = require('./controllers/album');
const { createUser, signInUser, getUsersList, createAdminUser } = require('../app/controllers/user');
const { checkValidationSchema } = require('./middlewares/checkSchema');
const { signUpValidator, signInValidator } = require('./schemas/user');
const { albumByIdValidator } = require('./schemas/album');
const { isAdminUser, allowList } = require('./middlewares/sessionValidator');
const { tokenValidator } = require('./middlewares/session');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAllAlbums);
  app.get('/albums/:id/photos', checkValidationSchema(albumByIdValidator), getPhotos);
  app.post('/users', checkValidationSchema(signUpValidator), createUser);
  app.post('/users/sessions', checkValidationSchema(signInValidator), signInUser);
  app.get('/users', tokenValidator, paginate.middleware(5, 50), getUsersList);
  app.post(
    '/admin/users',
    tokenValidator,
    checkValidationSchema(signUpValidator),
    isAdminUser,
    createAdminUser
  );
  app.post('/albums/:id', tokenValidator, buyAlbums);
  app.get('/users/:user_id/albums', tokenValidator, allowList, getAlbumsList);
};
