const requestPromise = require('request-promise');

const errors = require('../../app/errors');
const { MESSAGE_ALBUM_API_FAILED } = require('../../app/constants');

const albumResponse = [
  {
    id: 1,
    title: 'quidem molestiae enim'
  }
];

exports.albumMock = (value = albumResponse) => requestPromise.mockResolvedValue(value);
exports.errorAlbumMock = () =>
  requestPromise.mockRejectedValue(new Error(errors.albumError(MESSAGE_ALBUM_API_FAILED)));
