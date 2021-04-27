const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const streamifier = require('streamifier');


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'avatar-uploads',
    allowed_formats: 'jpg, png'
  }
});

const audioStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tracks-uploads',
    resource_type: 'video',
    allowed_formats: 'mp3'
  }
});

const uploader = multer({ storage });
const uploaderAudio = multer({ audioStorage });

module.exports = {
  uploader,
  uploaderAudio,
  cloudinary
};