require('dotenv').config({
  path: `${__dirname}/dev.env`,
});

const { MONGOURI, SECRETKEY } = process.env;

const config = {
  mongoURI: MONGOURI,
  secretKey: SECRETKEY,
};

console.log(config.mongoURI, config.secretKey);

module.exports = config;
