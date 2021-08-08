require('dotenv').config();
const mongoose = require('mongoose');
const URL = process.env.MONGODB_URL;

 const connection = async () => {
    try{
    const options = {
        useNewUrlParser:true, 
        useUnifiedTopology:true,
        usefindAndModify:false
    }
    await mongoose.connect(URL,options)
     console.log('mongodb connected')
    }catch(err){
      console.log('mongodb not found!!!')
    }
}

module.exports = connection;