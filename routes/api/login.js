const express = require('express');

const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');

const User = require('../../models/User.js');
// const auth = require('../../middleware/auth.js');

router.post(
  '/',
  [
    check('email', 'Please include a valid E-Mail').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'E-Mail not Registered' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Wrong Password' });
      }

      const payload = {
        user: {
          id: user._id,
        },
      };

      return jwt.sign(payload, config.get('secretKey'), { expiresIn: '5 days' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      return res.status(500).send('Server error');
    }
  }
);

module.exports = router;
