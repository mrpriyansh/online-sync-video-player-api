const express = require('express');

const router = express.Router();
const { addUser, getUser, removeUser } = require('./users');

module.exports = function(io) {
  io.on('connect', socket => {
    socket.on('join', async ({ userId, room }, callback) => {
      const { err, user } = await addUser(socket.id, userId, room);
      if (err) callback(err);
      socket.join(user.room);
      socket.emit('message', { user: 'admin', text: 'Welcome to room' });
      socket.broadcast
        .to(user.room)
        .emit('message', { user: 'admin', text: `${user.name} joined the chat` });
      return callback();
    });

    socket.on('sendMessage', async (message, callback) => {
      const { user } = await getUser(socket.id);
      io.to(user.room).emit('message', { user: user.name, text: message });
      return callback();
    });

    socket.on('disconnect', async () => {
      const { user } = await removeUser(socket.id);
      if (user) {
        io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
        // io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
      }
    });
  });
  return router;
};
