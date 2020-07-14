const express = require('express');
const connectDB = require('./config/db');

const app = express();
app.use(express.json({ extended: false }));
connectDB();

app.get('/', (req, res) => res.send('Server Up and Running'));
app.use('/login', require('./routes/api/login'));
app.use('/register', require('./routes/api/register'));
app.use('/contact', require('./routes/api/contactUs'));

const PORT = process.env.port || 4000;
app.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
