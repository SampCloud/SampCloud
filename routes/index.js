const { loginCheck, isSinger, isProducer } = require("./middlewares");
const User = require('../models/User');
const { uploader, cloudinary } = require("../config/cloudinary");

const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.post('/singerProfile/edit', uploader.single('avatar'), (req, res, next) => {
  const { artisticName, description, soundUrl } = req.body;
  const userId = req.session.user._id;
  const imgPath = req.file.path;
  const imgName = req.file.originalname;
  const publicId = req.file.filename;
  console.log(req.file);
  User.findByIdAndUpdate(userId, {
    artisticName: artisticName,
    imgPath: imgPath,
    imgName: imgName,
    publicId: publicId,
    description: description,
    soundUrl: soundUrl
  }, { new: true })
    .then(userUp => {
      req.session.user = userUp;
      console.log(userUp)
      res.redirect('/singerProfile',)
    })
    .catch(err => {
      next(err)
    })
});

router.post('/producerProfile/edit', uploader.single('avatar'), (req, res, next) => {
  const { artisticName, description, soundUrl } = req.body;
  const userId = req.session.user._id;
  const imgPath = req.file.path;
  const imgName = req.file.originalname;
  const publicId = req.file.filename;
  console.log(req.file);
  User.findByIdAndUpdate(userId, {
    artisticName: artisticName,
    imgPath: imgPath,
    imgName: imgName,
    publicId: publicId,
    description: description,
    soundUrl: soundUrl
  }, { new: true })
    .then(userUp => {
      req.session.user = userUp;
      console.log(userUp)
      res.redirect('/producerProfile',)
    })
    .catch(err => {
      next(err)
    })
});

router.get('/singerProfile', loginCheck(), isSinger(), (req, res) => {
  const currentUser = req.session.user;
  res.render('users/singer/singerProfile', { singerDetails: currentUser })
});

router.get('/producerProfile', loginCheck(), isProducer(), (req, res) => {
  const currentUser = req.session.user;
  res.render('users/producer/producerProfile', { producerDetails: currentUser });
});

router.get('/producerProfile/edit', loginCheck(), (req, res, next) => {
  const currentUser = req.session.user;
  res.render('users/producer/editProfile', { producerDetails: currentUser });
});

router.get('/singerProfile/edit', loginCheck(), (req, res, next) => {
  const currentUser = req.session.user;
  res.render('users/singer/editProfile', { singerDetails: currentUser });

});





module.exports = router;
