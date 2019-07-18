const nock = require('nock');

exports.albumMock = () =>
  beforeEach(() =>
    nock('https://jsonplaceholder.typicode.com')
      .get('/albums')
      .times(2)
      .query({ id: '1' })
      .reply(200, [
        {
          id: 1,
          title: 'quidem molestiae enim'
        }
      ])
  );
