require('dotenv').config();
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const url = process.env.MONGODB_URL;

const storage = new GridFsStorage({
    url,
    file:(req,file) => {
      return new Promise((resolve,reject) => {
        crypto.randomBytes(16, (err, buf) => {
            if(err) {
              return reject(err);
            }
         const filename = buf.toString('hex') + path.extname(file.originalname);
         const fileInfo = {
            filename:filename,
            bucketName:'uploads'
         };
         resolve(fileInfo)
        });
      });
    }
});

module.exports = multer({storage})