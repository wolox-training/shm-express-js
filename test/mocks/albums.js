const requestPromise = require('request-promise');

const albumResponse = [
  {
    id: 1,
    title: 'quidem molestiae enim'
  }
];

exports.albumMock = (value = albumResponse) => requestPromise.mockResolvedValue(value);
exports.errorAlbumMock = () => requestPromise.mockRejectedValue();
