/* eslint-disable guard-for-in */
const express = require('express');

const router = express.Router();
const { addUser, getUser, removeUser } = require('./users');

// eslint-disable-next-line func-names
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

      const users = io.sockets.adapter.rooms[room].sockets;
      // eslint-disable-next-line no-restricted-syntax
      for (const client in users) {
        if (client !== socket.id) {
          io.to(client).emit('sendAllInfo');
          return callback();
        }
      }
      return callback();
    });

    socket.on('sendMessage', async (message, callback) => {
      const { user } = await getUser(socket.id);
      // handle undefined user... **HAVE TO RESOLVE**
      if (!user) return callback({ error: true, msg: 'no user found' });
      console.log(`${user.name} sends ${message}`);
      io.to(user.room).emit('message', { user: user.name, text: message });
      return callback();
    });

    socket.on('disconnects', async userId => {
      const { user } = await removeUser(userId);
      if (user) {
        io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });

        socket.disconnect();
        // io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
      }
    });

    // *********** playerFunctions *************

    socket.on('setSeek', async ({ seekTime, type }, callback) => {
      const { user } = await getUser(socket.id);
      if (!user.room) return callback({ error: true, msg: 'no user found' });
      io.in(user.room).emit('getSeek', {
        time: seekTime,
        seekType: type,
      });
      return callback();
    });

    socket.on('sendURL', async (URL, callback) => {
      const { user } = await getUser(socket.id);
      if (!user.room) return callback({ error: true, msg: 'no user found' });
      io.in(user.room).emit('getURL', { URL });
      return callback();
    });

    socket.on('setPlayPause', async (isPlaying, time, callback) => {
      const { user } = await getUser(socket.id);
      if (!user || !user.room) return callback({ error: true, msg: 'room not found' });
      io.in(user.room).emit('getPlayPause', { isPlaying, time });
      return callback();
    });

    // socket.on('getAllInfo', async room => {
    //   // const users = io.sockets.clients(room);
    //   const users = io.sockets.adapter.rooms[room].sockets;
    //   console.log(room);
    //   const { user } = await getUser(socket.id);
    //   console.log(user);
    //   const socketId = socket.id;
    //   console.log('aadsafsda', socketId);
    //   // eslint-disable-next-line no-restricted-syntax
    //   for (const client in users) {
    //     if (client !== socketId) {
    //       console.log('a', client, socketId);
    //       io.to(client).emit('sendAllInfo', { socketId });
    //       return;
    //     }
    //     // console.log(client, socket.id);
    //   }
    //   return;
    // });
  });
  return router;
};
