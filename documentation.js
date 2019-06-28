const dictum = require('dictum.js');

dictum.document({
  description: 'Successful case when a user is created',
  endpoint: '/users',
  method: 'POST',
  requestHeaders: { 'Content- Type': 'application/json' },
  requestPathParams: {},
  requestBodyParams: {
    firstName: 'user firstName',
    lastName: 'user lastName',
    email: 'user email',
    password: 'user password'
  },
  responseStatus: 201,
  responseHeaders: {},
  responseBody: {
    firstName: 'user firstName',
    lastName: 'user lastName',
    message: 'User has been created successfully with ID X'
  },
  resource: 'User-created-successfully'
});
