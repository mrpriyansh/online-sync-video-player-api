const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./utils/config');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', require('./api/index.js'));

app.get('*', (req, res) => {
  res.status(404).send('You did something wrong! API endpoint not found.');
});

const port = config.port || 4000;

app.listen(port, () => console.log(`API server ready at http://localhost:${port}`));


