const router = require("express").Router();
const { loginCheck, isSinger, isProducer } = require("./middlewares");
const User = require('../models/User');
const { uploaderAudio, cloudinary } = require("../config/cloudinary");
const Track = require('../models/Track');
const streamifier = require('streamifier');
const fs = require('fs');



router.get('/singerProfile/addTrack', (req, res, next) => {
  res.render('users/singer/addTrack');
})

router.get('/producerProfile/addTrack', (req, res, next) => {
  res.render('users/producer/addTrack');
})

/* router.post('/singerProfile/addTrack', uploaderAudio.single('audio'), (req, res, next) => {
  const { title, genre, description } = req.body;
  const filePath = req.file.path;
  const fileName = req.file.originalname;
  const publicId = req.file.filename;
  //const uploadLocation = __dirname + '/uploads/' + req.file.originalname;
  //const buffer = fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer)));
  const buffer = req.file.buffer;
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
}); */

/* router.post('/singerProfile/addTrack', uploaderAudio.single('audio'), (req, res, next) => {
  // upload.single('file') is the multer setup which reads the incoming "mulipart/form-data"
  // parses it and adds it to the req.file with all the information and the Buffer (req.file.buffer).

  // absolute path where to save the temporary file. Includes the file name and extension
  // In order for the below writeFileSync operation to work properly, create additional directory named uploads
  // in the routes directory, as '/routes/uploads'
  let uploadLocation = __dirname + '/uploads/' + req.file.originalname;

  // write the BLOB to the server as a file
  fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer)))
    .then(track => {
      console.log(track)
      res.redirect('/singerProfile');
    })
    .catch(err => {
      next(err);
    })


}); */

router.post('/singerProfile/addTrack', uploaderAudio.single('audio'), (req, res) => {
  console.log('Got file:', req.file.originalname);
  console.log('Extra form fields:', req.body);


  cloudinary.uploader.upload_stream({ resource_type: "video" }, cloudinaryDone).end(req.file.buffer);

  // After the upload is completed, this callback gets called
  function cloudinaryDone(error, result) {
    if (error) {
      console.log("Error in cloudinary.uploader.upload_stream\n", error);
      return;
    } else {
      const { title, genre, description } = req.body;

      const fileName = req.file.originalname;
      const publicId = req.file.filename;
      console.log("Cloudinary audio info: ", result.audio);

      // If you want to see all the data that Cloudinary comes back with
      // console.log(result);

      console.log('Cloudinary url', result.url);
      Track.create({
        title: title,
        genre: genre,
        description: description,
        filePath: result.url,
        fileName: fileName,
        publicId: publicId,
        owner: req.session.user._id
      })
        .then(track => {
          console.log(track)
          res.redirect('/singerProfile');
        })
        .catch(err => {
          next(err);
        })
      // Send back the working URL for the client to display.
      //res.json({ cdn_url: result.url });
    }



  }
});


module.exports = router