const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../model/user');


const Registration = (req,res) => {
  try{
    const {firstname,surname,email,password,confirm_password} = req.body;
  let error = [];
  if(!firstname || !surname || !email || !password || !confirm_password){
     error.push({msg:'Please fill all fields'});
    //  console.log('please fill all fields')
  }

  if(password !== confirm_password){
      error.push({msg:'Passwords do not match'});
      // console.log('passwords do not match');
  };

  if(password.length < 6){
    error.push({msg:'password should be at least 6 character long!'})
    // console.log('password should be at least 6 character long!')
  }

  if(error.length > 0){
    res.render('reg',{
      firstname,
      surname,
      email,
      password,
      confirm_password
    })
  }else{
      User.findOne({email})
      .then(user => {
         if(user){
            // console.log('Email already registered')
            error.push({msg:'Email already registered'})
         }else{
            const newUser = new User({
               firstname,
               surname,
               email,
               password
            });
            bcrypt.genSalt(10,(err,salt) => bcrypt.hash(newUser.password, salt,(err, hash) => {
                if(err) throw err
              
                // set password to hash
              newUser.password = hash;

             newUser.save().then(user => {
                req.flash('success_msg','You are now registered and can log in');
                res.redirect('/login')
             })
             .catch(err => console.log(err));
            }))
         }
      }).catch(err => console.log(err));
}
  }catch(err){
   console.log(err)
  }
}


const Login = (req,res,next) => {
  passport.authenticate('local',{
    successRedirect:'/dashboard',
    failureRedirect:'/login',
    failureFlash:true
  })(req,res,next);
}

const forgetPassword = (req,res) => {
  let error = [];
  const {email} = req.body;
  try{
    User.findOne({email}).then((user) => {
       if(!user){
        // error.push({msg:'Invalid Email Address'});
        console.log({msg:'Invalid Email Address'});
       }else{
        
        res.redirect('/reset')
       }
    }).catch((err) => {
       throw err;
    })
  }catch(err){
    console.log(err)
  }
}

// const reset = (req,res) => {
//   const {password, confirm_password} = req.body;

// }

const imageUpload = (req,res) => {
//  res.json({file:req.file})
 res.redirect('/dashboard')
}

module.exports = {
    Registration,
    Login,
    forgetPassword,
    imageUpload
}
