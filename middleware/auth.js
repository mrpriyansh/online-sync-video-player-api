const jwt = require('jsonwebtoken');
const config = require('../config/config');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  try {
    // Get token from header
    if (!req.headers.authorization || req.headers.authorization.split(' ').length <= 1)
      return res.status(417).json({ msg: 'No token, authorization denied' });

    const token = req.headers.authorization.split(' ')[1];
    // Check if not token

    // Verify token

    // eslint-disable-next-line consistent-return
    jwt.verify(token, config.secretKey, (error, decoded) => {
      if (error) {
        return res.status(498).json({ msg: 'Token is not valid' });
      }

      req.user = decoded.user;
      next();
    });
  } catch (err) {
    console.error('something wrong with auth middleware', err);
    res.status(500).json({ msg: 'Server Error' });
  }
};
