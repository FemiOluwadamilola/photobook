const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const connection = require('./config/db');
const {ensureAuthenticated} = require('./config/auth');
const flash = require('connect-flash');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');


// const Routes = require('./routes/index');

// passport config
require('./config/passport')(passport);

const app = express();

//load config
require('dotenv').config();


 //db connnection
connection();

// variable for gridfsStream
let gfs;

const conn = mongoose.connection;
conn.once("open", () => {
 gfs = Grid(conn.db, mongoose.mongo);
 gfs.collection('uploads')
})


// EJS
app.use(expressLayouts);
app.set('layout','./layouts/layout')
app.set('view engine','ejs');

// BODY PASSER AND PUBLIC FOLDER
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(methodOverride('_method'));
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

//media route
app.get('/dashboard',ensureAuthenticated,(req,res) => {
  gfs.files.find().toArray((err, files) => {
    if(!files || files.length === 0){
      res.render('dashboard',{
        title:'dashboard',
        user:req.user,
        files:false
      })
    }else{
      files.map(file => {
        if(file.contentType === "image/jpeg" || file.contentType === "image/png"){
           file.isImage = true;
        }else{
           file.isImage = false;
        }
      });
      
      res.render('dashboard',{
        title:'dashboard',
        user:req.user,
        files:files,
      })
    }
  })
})

// app.get('/images', (req,res) => {
//   gfs.files.find().toArray((err,files){
//     if(!files || files.length === 0){

//     }
//   })
// })

// display single image
app.get('/image/:filename', (req,res) => {
  gfs.files.findOne({filename:req.params.filename}, (err,file) => {
    if(!file || file.length === 0){
      return res.status(404).json({
         err:"No file exists"
      });
    }
   
    if(file.contentType === 'image/jpeg' || file.contentType === 'image/jpeg'){
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    }else{
      return res.status(404).json({
        err:"Not an image"
     });
    }
  })
})

// ENV VARIABLE
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`app running in ${process.env.NODE_ENV} mode on localhost:${PORT}`));
