const express = require('express');

const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User.js');

const { addUser, getUser, removeUser, getUsersInRoom } = require('./users');

module.exports = function(app, io) {
  router.get('/', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  io.on('connection', socket => {
    // eslint-disable-next-line consistent-return
    socket.on('join', ({ id, room }, callback) => {
      const { error, user } = addUser({ socketId: socket.id, id, room });

      if (error) return callback(error);
      socket.join(user.room);

      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

      callback();
    });

    socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id);

      io.to(user.room).emit('message', { user: user.name, text: message });

      callback();
    });

    socket.on('disconnect', () => {
      const user = removeUser(socket.id);

      if (user) {
        io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
      }
    });
  });
};
