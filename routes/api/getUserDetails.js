const express = require('express');
const User = require('../../models/User');
const auth = require('../../middleware/auth');

const router = express.Router();

router.get('/', [auth], async (req, res) => {
  const user = await User.findOne({ _id: req.user.id }, { password: 0 });
  res.json(user);
});

module.exports = router;
