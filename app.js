const express = require('express');
const ejs = require('ejs');

const app = express();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`app running on port ${PORT}`));
