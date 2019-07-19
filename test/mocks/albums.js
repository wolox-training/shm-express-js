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

exports.albumPhotosMock = () =>
  beforeEach(() =>
    nock('https://jsonplaceholder.typicode.com')
      .get('/photos')
      .query({ albumId: '1' })
      .reply(200, [
        {
          albumId: 1,
          id: 1,
          title: 'accusamus beatae ad facilis cum similique qui sunt',
          url: 'https://via.placeholder.com/600/92c952',
          thumbnailUrl: 'https://via.placeholder.com/150/92c952'
        },
        {
          albumId: 1,
          id: 2,
          title: 'reprehenderit est deserunt velit ipsam',
          url: 'https://via.placeholder.com/600/771796',
          thumbnailUrl: 'https://via.placeholder.com/150/771796'
        }
      ])
  );
