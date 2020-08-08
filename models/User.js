const mongoose = require('mongoose');

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  socketId: {
    type: String,
    required: false,
    unique: true,
  },
  room: {
    type: String,
    required: false,
    unique: true,
  },
});

module.exports = mongoose.model('User', User);
