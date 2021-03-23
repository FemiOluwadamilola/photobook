const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongo = require('mongodb');
// const Routes = require('./routes/index');

const app = express();
// load config
dotenv.config({path:'./config/config.env'});

// EJS
app.use(expressLayouts);
app.set('layout','./layouts/layout')
app.set('view engine','ejs');

// BODY PASSER AND PUBLIC FOLDER
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

// ROUTER MIDDLEWARE
app.use('/', require('./routes/route'));

// ENV VARIABLE
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`app running in ${process.env.NODE_ENV} mode on ${PORT}`));
