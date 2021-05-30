const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const {Registration, Login} = require('../controllers/index');

router.get('/', (req,res) => {
  res.render('home', {title:'Welcome'});
})


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

router.get('/logout', (req,res) => {
  req.flash('success_msg','You are logged out');
   res.redirect('/login')
})

router.post('/login', Login)

router.post('/reg', Registration)

router.post('/upload',(req,res) => {
  const upload = req.body;
  console.log(upload);
  res.redirect('dashboard')
})


module.exports = router;