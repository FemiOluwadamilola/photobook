const path = require('path');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../model/user');
const multer = require('multer');
const storage = require('../config/upload');


const Registration = (req,res) => {
  try{
    const {firstname,surname,email,password,confirm_password} = req.body;
  let errors = [];
  if(!firstname || !surname || !email || !password || !confirm_password){
     errors.push({msg:'Please fill all fields'});
  }

  if(password !== confirm_password){
      errors.push({msg:'Passwords do not match'});
  };

  if(password.length < 6){
    errors.push({msg:'password should be at least 6 character long!'})
  }

  if(errors.length > 0){
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
            errors.push({msg:'Email already registered'})
            // console.log('Email already registered');
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
  try{
    let errors = [];
    const {email} = req.body;
    User.findOne({email}).then((user) => {
       if(!user){
        errors.push({msg:'Oops sorry this email does not exist on our database!!!'});
        // console.log('Oops sorry this email does not exist on our database!!!')
       }else{
        // res.send(user._id);
        console.log(user._id);
        res.redirect(`/reset?_id=${user._id}`);
       }
    }).catch((err) => {
       throw err;
    })
  }catch(err){
    console.log(err)
  }
}

const resetPassword = (req,res) => {
  try{
   const {_id} = req.params;
   const {password,confirm_password} = req.body;
   let errors = [];

   if(password === confirm_password){
    res.render('reset',{
      password,
      confirm_password
    })
     console.log('Oops passwords does not match');
   }else{
     User.findById({_id}).then((user) => {
       if(!user){
         res.redirect('/forgetPassword');
       }else{
         const resetUserPassword = new User({
           password
         })
         bcrypt.genSalt(10,(err,salt) => bcrypt.hash(resetUserPassword.password, salt,(err, hash) => {
          if(err) throw err
        
          // set password to hash
          resetUserPassword.password = hash;

          resetUserPassword.save().then(user => {
          req.flash('success_msg','Password reset Successfully');
          res.redirect('/login')
       })
       .catch(err => console.log(err));
      }))
     }
     })
   }
  }catch(err){
    console.log(err)
  }
}


const imageUpload = (req,res) => {
  // const {_id} = req.user;
  try{
    let errors = [];
    const imageUpload = multer({storage,
    fileFilter:(req,file, cb) => {
      const ext = path.extname(file.originalname);
      if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== 'jpeg'){
        // errors.push({msg:'Oops sorry only images allowed..'})
        console.log({msg:'Oops sorry only images allowed..'})
      }else{
        cb(null, true)
      }
    }
    }).single('image');

    
    imageUpload(req,res, (err) => {
      if(err){
        console.log('Something went wrong')
      }else{
        const userProfileId = req.user._id; 
         User.findOneAndUpdate(
        {_id:userProfileId},
        {$push:{images:req.file.filename}},
        function(error,success){
          if(error){
            console.log(error)
          }else{
            console.log('image upload successfully...')
            res.redirect('/dashboard')
          }
        }
        );
      }
    })
  }catch(error){
   console.log(error)
  }
}

module.exports = {
    Registration,
    Login,
    forgetPassword,
    imageUpload,
    resetPassword
}
