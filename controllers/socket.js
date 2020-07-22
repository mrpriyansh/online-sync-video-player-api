const express = require('express');

const router = express.Router();
const { addUser, getUser, removeUser, getUsersInRoom } = require('./users');

module.exports = function(io) {
  io.on('connection', socket => {
    socket.on('join', ({ name, room }, callback) => {
      const { error, user } = addUser({ socketId: socket.id, name, room });
      if (error) return callback(error);

      socket.join(user.room);
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
      return callback();
    });

    socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id);
      io.to(user.room).emit('message', { user: user.name, text: message });
      return callback();
    });

    socket.on('disconnect', () => {
      const user = removeUser(socket.id);
      if (user) {
        io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
      }
    });
  });
  return router;
};
