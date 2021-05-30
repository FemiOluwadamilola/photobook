const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
// const Routes = require('./routes/index');

// passport config
require('./config/passport')(passport);

const app = express();

//load config
require('dotenv').config();

 //db config
const URL = process.env.MONGODB_URL;

mongoose.connect(URL,{useNewUrlParser:true, useUnifiedTopology:true})
.then(()=> console.log('mongodb connected'))
.catch((err) => console.log(err))


// EJS
app.use(expressLayouts);
app.set('layout','./layouts/layout')
app.set('view engine','ejs');

// BODY PASSER AND PUBLIC FOLDER
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

// express-session
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

// Global vars
app.use((req,res,next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// ROUTER MIDDLEWARE
app.use('/', require('./routes/route'));

// ENV VARIABLE
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`app running in ${process.env.NODE_ENV} mode on localhost:${PORT}`));
