const { loginCheck, isSinger, isProducer } = require("./middlewares");
const User = require('../models/User');
const { uploader, cloudinary } = require("../config/cloudinary");
const Track = require('../models/Track');

const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.post('/singerProfile/editBG', loginCheck(), uploader.single('bgImg'), (req, res, next) => {
  if (req.file === undefined) {
    res.redirect('/singerProfile',)
  } else {
    const bgImg = req.file.path;
    const bgImgName = req.file.originalname;
    const bgPublicId = req.file.filename;
    const userId = req.session.user._id;
    User.findByIdAndUpdate(userId, {
      bgImg: bgImg,
      bgImgName: bgImgName,
      bgPublicId: bgPublicId,
    }, { new: true })
      .then(userUp => {
        req.session.user = userUp;
        //console.log(userUp)
        res.redirect('/singerProfile',)
      })
      .catch(err => {
        next(err)
      })
  }
})

router.post('/producerProfile/editBG', loginCheck(), uploader.single('bgImg'), (req, res, next) => {
  if (req.file === undefined) {
    res.redirect('/producerProfile',)
  } else {
    const bgImg = req.file.path;
    const bgImgName = req.file.originalname;
    const bgPublicId = req.file.filename;
    const userId = req.session.user._id;
    User.findByIdAndUpdate(userId, {
      bgImg: bgImg,
      bgImgName: bgImgName,
      bgPublicId: bgPublicId,
    }, { new: true })
      .then(userUp => {
        req.session.user = userUp;
        //console.log(userUp)
        res.redirect('/producerProfile',)
      })
      .catch(err => {
        next(err)
      })
  }
})


router.post('/singerProfile/edit', loginCheck(), uploader.single('avatar'), (req, res, next) => {
  if (req.file === undefined) {
    const { artisticName, description, soundUrl } = req.body;
    const userId = req.session.user._id;
    //console.log(req.file);
    User.findByIdAndUpdate(userId, {
      artisticName: artisticName,
      description: description,
      soundUrl: soundUrl
    }, { new: true })
      .then(userUp => {
        req.session.user = userUp;
        res.redirect('/singerProfile',)
      })
      .catch(err => {
        next(err)
      })
  } else {
    const { artisticName, description, soundUrl } = req.body;
    const userId = req.session.user._id;
    const imgPath = req.file.path;
    const imgName = req.file.originalname;
    const publicId = req.file.filename;
    //console.log(req.file);
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
        //console.log(userUp)
        res.redirect('/singerProfile',)
      })
      .catch(err => {
        next(err)
      })
  }
});

router.post('/producerProfile/edit', loginCheck(), uploader.single('avatar'), (req, res, next) => {
  if (req.file === undefined) {
    const { artisticName, description, soundUrl } = req.body;
    const userId = req.session.user._id;
    //console.log(req.file);
    User.findByIdAndUpdate(userId, {
      artisticName: artisticName,
      description: description,
      soundUrl: soundUrl
    }, { new: true })
      .then(userUp => {
        req.session.user = userUp;
        //console.log(userUp)
        res.redirect('/producerProfile',)
      })
      .catch(err => {
        next(err)
      })
  } else {
    const { artisticName, description, soundUrl } = req.body;
    const userId = req.session.user._id;
    const imgPath = req.file.path;
    const imgName = req.file.originalname;
    const publicId = req.file.filename;
    //console.log(req.file);
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
        //console.log(userUp)
        res.redirect('/producerProfile',)
      })
      .catch(err => {
        next(err)
      })
  }
});

router.get('/singerProfile', loginCheck(), isSinger(), (req, res) => {
  const currentUser = req.session.user;
  Track.find({ owner: currentUser._id })
    .then(tracks => {
      console.log('Tracks', tracks)
      res.render('users/singer/singerProfile', { singerDetails: currentUser, tracks })
    })
});

router.get('/producerProfile', loginCheck(), isProducer(), (req, res) => {
  const currentUser = req.session.user;
  console.log(currentUser)
  res.render('users/producer/producerProfile', { producerDetails: currentUser });
});

router.get('/producerProfile/edit', loginCheck(), (req, res, next) => {
  const currentUser = req.session.user;
  res.render('users/producer/editProfile', { producerDetails: currentUser });
});

router.get('/singerProfile/edit', loginCheck(), isSinger(), (req, res, next) => {
  const currentUser = req.session.user;
  res.render('users/singer/editProfile', { singerDetails: currentUser });
});

router.get('/producerProfile/savedSamples', loginCheck(), (req, res, next) => {
  const currentUser = req.session.user;
  User.findById(currentUser._id).populate('savedSamples')
    .then(user => {
      console.log(user)
      res.render('users/producer/savedSamples', { producerDetails: user });
    })
});

router.get('/producerProfile/likedSamples', loginCheck(), (req, res, next) => {
  const currentUser = req.session.user;
  User.findById(req.session.user._id).populate('likedSamples')
    .then(user => {
      console.log(user)
      res.render('users/producer/likedSample', { producerDetails: user });
    })
});


module.exports = router;