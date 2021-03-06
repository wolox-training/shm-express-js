const paginate = require('express-paginate');

const { healthCheck } = require('./controllers/healthCheck');
const { getAlbums, getPhotos, buyAlbums, getAlbumsList, getAlbumPhotosList } = require('./controllers/album');
const {
  createUser,
  signInUser,
  getUsersList,
  createAdminUser,
  disableAllSessions
} = require('../app/controllers/user');
const { checkValidationSchema } = require('./middlewares/checkSchema');
const { signUpValidator, signInValidator } = require('./schemas/user');
const { albumByIdValidator, userByIdValidator } = require('./schemas/album');
const { isAdminUser, allowList } = require('./middlewares/sessionValidator');
const { tokenValidator } = require('./middlewares/session');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
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
  app.post('/albums/:id', tokenValidator, checkValidationSchema(albumByIdValidator), buyAlbums);
  app.get(
    '/users/:userId/albums',
    tokenValidator,
    checkValidationSchema(userByIdValidator),
    allowList,
    getAlbumsList
  );
  app.get(
    '/users/albums/:id/photos',
    tokenValidator,
    checkValidationSchema(albumByIdValidator),
    getAlbumPhotosList
  );
  app.post('/users/sessions/invalidate_all', tokenValidator, disableAllSessions);
};
