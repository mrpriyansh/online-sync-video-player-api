const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const connectDB = require('./config/db');

const { addUser, getUser, removeUser, getUsersInRoom } = require('./routes/api/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.json({ extended: false }));
connectDB();

io.on('connection', socket => {
  // eslint-disable-next-line consistent-return
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ socketId: socket.id, name, room });

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

app.get('/', (req, res) => res.send('Server Up and Running'));
app.use('/login', require('./routes/api/login'));
app.use('/register', require('./routes/api/register'));
app.use('/contact', require('./routes/api/contactus'));

const PORT = process.env.port || 4000;
app.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
