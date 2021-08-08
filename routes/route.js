const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const {Registration, Login, forgetPassword,resetPassword, imageUpload} = require('../controllers/index');
const ImageUpload = require('../config/upload');


router.get('/', (req,res) => {
  res.render('home', {title:'Welcome'});
})


//media route
router.get('/dashboard',ensureAuthenticated,(req,res) => {
  res.render('dashboard',{
    title:'dashboard',
    user:req.user
  })
})

router.get('/login', (req,res) => {
  res.render('login', {title:'login'});
})


router.get('/reg', (req,res) => {
  res.render('reg',{
    title:'registration'
  });
})

router.get('/forgetpassword', (req,res) => {
 res.render('forgetPassword',{
   title:'forget password'
 });
})

router.get('/reset',(req,res) => {
  res.render('reset', {
     title:'Reset password'
  })
})

router.get('/logout', (req,res) => {
  req.flash('success_msg','You are logged out');
   res.redirect('/login')
})


router.post('/login', Login)

router.post('/reg', Registration)

router.post('/forgetpassword', forgetPassword)

router.put('/reset/:id',resetPassword)
/*
 image upload to db route
*/
router.post('/upload',imageUpload)





module.exports = router;