const router = require("express").Router();
const { loginCheck, isSinger, isProducer } = require("./middlewares");
const User = require('../models/User');
const { uploader, uploaderAudio, cloudinary } = require("../config/cloudinary");
const Track = require('../models/Track');
const streamifier = require('streamifier');
const fs = require('fs');

router.get('/search', (req, res, next) => {
  Track.find()
    .then(tracks => {
      res.render('search', { tracklist: tracks })
    });
})

router.post('/search', (req, res, next) => {
  console.log('query', req.body)
  Track.find()
    .then(tracks => {
      const filteredTracks = tracks.filter(track => {
        return track.title.toLowerCase().includes(req.body.q.toLowerCase())

      })
      res.render('search', { tracklist: filteredTracks })
    })
})





router.get('/singerProfile/addTrack', (req, res, next) => {
  res.render('users/singer/addTrack');
})

router.get('/producerProfile/addTrack', (req, res, next) => {
  res.render('users/producer/addTrack');
})



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

      console.log('Cloudinary url', result.url);
      Track.create({
        title: title,
        genre: genre,
        description: description,
        imgPath: 'https://res.cloudinary.com/davidx8/image/upload/v1619543579/avatar-uploads/poolside-pack_qst27z.png',
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
    }
  }
});

router.get('/editSample/:sampleId', loginCheck(), (req, res, next) => {
  console.log(req.params)
  Track.findById(req.params.sampleId)
    .then(track => {
      res.render('users/singer/editTrack', { trackDetails: track });
    })

});

router.post('/editSample/:sampleId', uploader.single('cover'), (req, res, next) => {
  const { title, description } = req.body;
  const imgPath = req.file.path;
  const imgName = req.file.originalname;
  const publicId = req.file.filename;
  console.log(req.file);
  Track.findByIdAndUpdate(req.params.sampleId, {
    title: title,
    imgPath: imgPath,
    imgName: imgName,
    publicId: publicId,
    description: description,
  }, { new: true })
    .then(trackUp => {
      req.params.sampleId = trackUp;
      res.redirect('/singerProfile',)
    })
    .catch(err => {
      next(err)
    })
});


module.exports = router