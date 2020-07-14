const express = require('express');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.get('/', (req, res) => res.send('Server Up and Running'));
app.use('/login', require('./routes/api/login'));
app.use('/register', require('./routes/api/register'));
app.user('/contact', require('./routes/api/contactUs'));

const PORT = process.env.port || 4000;
app.listen(PORT);
