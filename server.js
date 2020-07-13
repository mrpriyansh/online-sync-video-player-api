const express = require('express');

const app = express();

app.get('/', (req, res) => res.send('Server Up and Running'));

const PORT = process.env.port || 4000;
app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));
