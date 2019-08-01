const requestPromise = require('request-promise');

const albumResponse = [
  {
    id: 1,
    title: 'quidem molestiae enim'
  }
];
const albumPhotosResponse = [
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
];

exports.albumMock = (value = albumResponse) => requestPromise.mockResolvedValue(value);
exports.errorAlbumMock = () => requestPromise.mockRejectedValue();
exports.albumPhotosMock = () => requestPromise.mockResolvedValue(albumPhotosResponse);
