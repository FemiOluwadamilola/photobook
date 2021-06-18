require('dotenv').config();
const mongoose = require('mongoose');
const URL = process.env.MONGODB_URL;

 const connection = async () => {
    try{
    const connectionParams = {
        useNewUrlParser:true, 
        useUnifiedTopology:true
    }
    await mongoose.connect(URL,connectionParams)
      console.log('mongodb connected')
    }catch(err){
      console.log('mongodb not found!!!')
    }
}

module.exports = connection;