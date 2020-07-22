const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

connectDB();

app.use(express.json({ extended: false }));
app.use(require('./controllers/socket')(io));
app.use('/login', require('./routes/api/login'));
app.use('/register', require('./routes/api/register'));
app.use('/contact', require('./routes/api/contactus'));

const PORT = process.env.port || 4000;
app.get('/', (req, res) => res.send('Server Up and Running'));
server.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
