const axios = require('axios');
const logger = require('../../app/logger');
const PREVIOUS_MESSAGE = 'Making request..';
const MESSAGE_OK = 'Request made correctly, sending ...';

const getAlbums = async (req, res) => {
  const urlAlbums = 'https://jsonplaceholder.typicode.com/albums';

  try {
    logger.info(PREVIOUS_MESSAGE);
    const { data } = await axios.get(urlAlbums);
    logger.info(MESSAGE_OK);
    res.status(200).send(data);
  } catch (error) {
    res.send(error.message);
  }
};

const getPhotos = async (req, res) => {
  try {
    if (req.params.id > 10 || isNaN(req.params.id)) {
      throw Error('Make sure your request is correct');
    }
    logger.info(PREVIOUS_MESSAGE);
    const urlPhotos = `https://jsonplaceholder.typicode.com/photos?albumId=${req.params.id}`;
    const { data } = await axios.get(urlPhotos);
    const imgUrl = data.map(({ url }) => url);

    logger.info(MESSAGE_OK);
    res.status(200).send(imgUrl);
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = { getAlbums, getPhotos };
