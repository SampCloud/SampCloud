const router = require('express').Router();
const { loginCheck, isSinger, isProducer } = require('./middlewares');
const User = require('../models/User');
const { uploader, uploaderAudio, cloudinary } = require('../config/cloudinary');
const SavedTrack = require('../models/SavedTrack');
const Track = require('../models/Track');

router.get('/search', (req, res, next) => {
  const currentUser = req.session.user;
  Track.find().then((tracks) => {
    res.render('search', { tracklist: tracks, currentUser });
  });
});

router.post('/search', (req, res, next) => {
  Track.find().then((tracks) => {
    const filteredTracks = tracks.filter((track) => {
      return track.title.toLowerCase().includes(req.body.q.toLowerCase());
    });
    res.render('search', { tracklist: filteredTracks });
  });
});

router.get('/singerProfile/addTrack', isSinger(), (req, res, next) => {
  res.render('users/singer/addTrack');
});

router.get('/producerProfile/addTrack', (req, res, next) => {
  res.render('users/producer/addTrack');
});

router.post(
  '/singerProfile/addTrack',
  isSinger(),
  loginCheck(),
  uploaderAudio.single('audio'),
  (req, res) => {
    //console.log('Got file:', req.file.originalname);
    //console.log('Extra form fields:', req.body);
    if (req.file === undefined) {
      res.redirect('/singerProfile');
      return;
    }
    cloudinary.uploader
      .upload_stream({ resource_type: 'video' }, cloudinaryDone)
      .end(req.file.buffer);

    function cloudinaryDone(error, result) {
      if (error) {
        //console.log("Error in cloudinary.uploader.upload_stream\n", error);
        return;
      } else {
        const { title, genre, description } = req.body;
        const fileName = req.file.originalname;
        const publicId = req.file.filename;
        console.log('Cloudinary audio info: ', result.audio);
        console.log('what is this?', req.file);
        console.log('Cloudinary url', result);
        Track.create({
          title: title,
          genre: genre,
          description: description,
          imgPath:
            'https://res.cloudinary.com/davidx8/image/upload/v1619769517/avatar-uploads/default-sample-cover_xntxwt.png',
          filePath: result.url,
          fileName: fileName,
          publicId: result.public_id,
          owner: req.session.user._id,
          likes: 0,
        })
          .then((track) => {
            res.redirect('/singerProfile');
          })
          .catch((err) => {
            next(err);
          });
      }
    }
  }
);

router.get(
  '/editSample/:sampleId',
  isSinger(),
  loginCheck(),
  (req, res, next) => {
    //console.log(req.params)
    Track.findById(req.params.sampleId).then((track) => {
      res.render('users/singer/editTrack', { trackDetails: track });
    });
  }
);

router.post(
  '/editSample/:sampleId',
  isSinger(),
  loginCheck(),
  uploader.single('cover'),
  (req, res, next) => {
    if (req.file === undefined) {
      const { title, description } = req.body;
      //console.log(req.file);
      Track.findByIdAndUpdate(
        req.params.sampleId,
        {
          title: title,
          description: description,
        },
        { new: true }
      )
        .then((trackUp) => {
          req.params.sampleId = trackUp;
          res.redirect('/singerProfile');
        })
        .catch((err) => {
          next(err);
        });
    } else {
      const { title, description } = req.body;
      const imgPath = req.file.path;
      const imgName = req.file.originalname;
      const publicId = req.file.filename;
      //console.log(req.file);
      Track.findByIdAndUpdate(
        req.params.sampleId,
        {
          title: title,
          imgPath: imgPath,
          imgName: imgName,
          publicId: publicId,
          description: description,
        },
        { new: true }
      )
        .then((trackUp) => {
          req.params.sampleId = trackUp;
          res.redirect('/singerProfile');
        })
        .catch((err) => {
          next(err);
        });
    }
  }
);

router.get('/trackDetails/:sampleId', loginCheck(), (req, res, next) => {
  //console.log(req.params)
  const currentUser = req.session.user;
  Track.findById(req.params.sampleId)
    .populate('owner')
    .then((track) => {
      User.findById(currentUser._id)
        .populate('likedSamples')
        .populate('savedSamples')
        .then((user) => {
          const likedIdArr = user.likedSamples.map((x) => x.likedId);
          const savedIdArr = user.savedSamples.map((x) => x.savedId);
          const isLiked = likedIdArr.includes(track._id);
          const isSaved = savedIdArr.includes(track._id);
          track.isLiked = isLiked;
          track.isSaved = isSaved;
          res.render('users/details/tracksDetails', {
            trackDetails: track,
            currentUser: user,
          });
        });
    });
});

router.get('/profileDetails/:ownerId', loginCheck(), (req, res, next) => {
  //console.log('what is this:', req.params)
  const currentUser = req.session.user;
  User.findById(req.params.ownerId).then((user) => {
    Track.find({ owner: req.params.ownerId }).then((tracks) => {
      res.render('users/details/profileDetails', {
        profileDetails: user,
        trackDetails: tracks,
        currentUser,
      });
    });
    //console.log('the user', user)
  });
});

router.get('/delete/:sampleId', loginCheck(), isSinger(), (req, res, next) => {
  Track.findByIdAndDelete(req.params.sampleId)
    .then((deletedTrack) => {
      if (deletedTrack.publicId) {
        cloudinary.uploader.destroy(deletedTrack.publicId);
      }
      res.redirect('/singerProfile');
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/likeASample', (req, res) => {
  const { id, title, imgPath, username, filePath, description } = req.body;

  Track.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true }).then(
    (liked) => {
      SavedTrack.create({
        title: title,
        imgPath: imgPath,
        filePath: filePath,
        onwer: username,
        likedId: id,
        description: description,
      })
        .then((track) => {
          User.findByIdAndUpdate(
            req.session.user._id,
            {
              $push: { likedSamples: track._id },
            },
            { new: true }
          )
            .populate('likedSamples')
            .then((user) => {
              console.log(user);
              res.redirect(`/trackDetails/${id}`);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => console.log(err));
    }
  );
});

router.post('/saveASample', (req, res) => {
  const currentUser = req.session.user;
  const { id, title, imgPath, username, filePath, description } = req.body;
  SavedTrack.create({
    title: title,
    imgPath: imgPath,
    filePath: filePath,
    onwer: username,
    savedId: id,
    description: description,
  })
    .then((track) => {
      User.findByIdAndUpdate(
        currentUser._id,
        {
          $push: { savedSamples: track._id },
        },
        { new: true }
      )
        .populate('savedSamples')
        .then((user) => {
          res.redirect(`/trackDetails/${id}`);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
});

router.get('/deleteASavedSample/:id', (req, res) => {
  const currentUser = req.session.user;
  SavedTrack.findByIdAndDelete(req.params.id)
    .then((deletedSample) => {
      User.findByIdAndUpdate(
        currentUser._id,
        {
          $pull: { savedSamples: deletedSample._id },
        },
        { new: true }
      )
        .populate('savedSamples')
        .then((user) => {
          res.redirect(`/producerProfile/savedSamples`);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
});

router.get('/deleteASavedTrack/:id', (req, res) => {
  const currentUser = req.session.user;
  SavedTrack.findOneAndDelete({ savedId: req.params.id })
    .then((deletedSample) => {
      console.log(deletedSample);
      User.findByIdAndUpdate(
        currentUser._id,
        {
          $pull: { savedSamples: deletedSample._id },
        },
        { new: true }
      )
        .populate('savedSamples')
        .then((user) => {
          res.redirect(`/trackDetails/${req.params.id}`);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
});

router.get('/deleteALikedTrack/:id', (req, res) => {
  const currentUser = req.session.user;
  Track.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: -1 } },
    { new: true }
  ).then((unliked) => {
    SavedTrack.findOneAndDelete({ likedId: req.params.id })
      .then((deletedSample) => {
        console.log(deletedSample);
        User.findByIdAndUpdate(
          currentUser._id,
          {
            $pull: { likedSamples: deletedSample._id },
          },
          { new: true }
        )
          .populate('likedSamples')
          .then((user) => {
            res.redirect(`/trackDetails/${req.params.id}`);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => console.log(err));
  });
});

router.get('/deleteALikedSample/:id', (req, res) => {
  const currentUser = req.session.user;
  SavedTrack.findByIdAndDelete(req.params.id)
    .then((deletedSample) => {
      User.findByIdAndUpdate(
        currentUser._id,
        {
          $pull: { likedSamples: deletedSample._id },
        },
        { new: true }
      )
        .populate('likedSamples')
        .then((user) => {
          res.redirect(`/producerProfile/likedSamples`);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
