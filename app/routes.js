const { healthCheck } = require('./controllers/healthCheck'),
  { getAlbumsInventory, getPhotos } = require('./controllers/album');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbumsInventory);
  app.get('/albums/:id/photos', getPhotos);
};
