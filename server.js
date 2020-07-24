const express = require('express');
const socketio = require('socket.io');
const http = require('https');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketio(server, {
  handlePreflightRequest: (req, res) => {
    const headers = {
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': req.headers.origin,
      'Access-Control-Allow-Credentials': true,
    };
    res.writeHead(200, headers);
    res.end();
  },
});

app.use(express.json({ extended: false }));

connectDB();

app.use(express.json({ extended: false }));
app.use(require('./controllers/socket')(io));
app.use('/login', require('./routes/api/login'));
app.use('/register', require('./routes/api/register'));
app.use('/contact', require('./routes/api/contactus'));
app.use('/userDetails', require('./routes/api/getUserDetails'));

const PORT = process.env.port || 4000;
app.get('/', (req, res) => res.send('Server Up and Running'));
server.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
