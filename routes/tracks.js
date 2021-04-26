const router = require("express").Router();
const { loginCheck, isSinger, isProducer } = require("./middlewares");
const User = require('../models/User');
const { uploaderAudio, cloudinary } = require("../config/cloudinary");
const Track = require('../models/Track');
const streamifier = require('streamifier');



router.get('/singerProfile/addTrack', (req, res, next) => {
  res.render('users/singer/addTrack');
})

router.get('/producerProfile/addTrack', (req, res, next) => {
  res.render('users/producer/addTrack');
})

router.post('/singerProfile/addTrack', uploaderAudio.single('audio'), (req, res, next) => {
  const { title, genre, description } = req.body;
  const filePath = req.file.path;
  const fileName = req.file.originalname;
  const publicId = req.file.filename;
  //const uploadLocation = __dirname + '/uploads/' + req.file.originalname;
  const buffer = req.file.buffer;
  //fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(buffer)));


  console.log(req.file);
  Track.create({
    title: title,
    genre: genre,
    description: description,
    filePath: filePath,
    fileName: fileName,
    publicId: publicId,
    buffer: buffer,
    owner: req.session.user._id
  })
    .then(track => {
      console.log(track)
      res.redirect('/singerProfile');
    })
    .catch(err => {
      next(err);
    })
});



module.exports = router