const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   firstname:{
     type:String,
     require:true
   },
   surname:{
     type:String,
     require:true
   },
   email:{
     type:String,
     require:true
   },
   password:{
     type:String,
     require:true
   },
   date:{
     type:Date,
     default:Date.now
   },
   images:[]
})

const User = mongoose.model('User', userSchema);

module.exports = User;