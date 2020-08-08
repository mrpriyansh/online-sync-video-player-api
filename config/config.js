require('dotenv').config();

const { MONGOURI, SECRETKEY } = process.env;

const config = {
  mongoURI: MONGOURI,
  secretKey: SECRETKEY,
};

module.exports = config;
