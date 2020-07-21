const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const connectDB = require('./config/db');

app.use(express.json({ extended: false }));
connectDB();

app.get('/', (req, res) => res.send('Server Up and Running'));
app.use('/room', require('./routes/api/room'));
app.use('/login', require('./routes/api/login'));
app.use('/register', require('./routes/api/register'));
app.use('/contact', require('./routes/api/contactus'));

const PORT = process.env.port || 4000;
app.listen(PORT, () => console.log(`Server is up on port ${PORT}`));

require('./routes/api/room')(app, io);
