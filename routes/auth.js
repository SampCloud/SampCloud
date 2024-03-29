const router = require("express").Router();
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/signup', (req, res,) => {
  res.render('signup');
});


router.get('/login', (req, res) => {
  res.render('login');
})

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username: username })
    .then(userFromDB => {
      if (userFromDB === null) {
        res.render('login', { message: 'Invalid credentials. Please try again.' });
        return;
      }
      if (!bcrypt.compareSync(password, userFromDB.password)) {
        res.render('login', { message: 'Invalid credentials. Please try again.' });
        return;
      }
      if (bcrypt.compareSync(password, userFromDB.password)) {
        req.session.user = userFromDB;
        res.redirect('/search');

      }
    })
})


router.post('/signup', (req, res, next) => {

  const { username, password, role, email } = req.body;

  if (password.length < 6 && username === '') {
    res.render('signup', { message: 'Username and password are required.' });
    return
  }
  if (password.length < 6) {
    res.render('signup', { message: 'Password must contain at least 6 characters.' });
    return
  }
  if (username === '') {
    res.render('signup', { message: 'Username cannot be empty.' });
    return
  }

  User.findOne({ username: username })
    .then(userFromDB => {

      if (userFromDB !== null) {
        res.render('signup', { message: 'Username is already taken' });
      } else {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);
        //console.log(hash);
        User.create({ username: username, password: hash, email: email, role: role })
          .then(createdUser => {
            //console.log(createdUser);
            req.login(createdUser, err => {
              if (err) {
                next(err);
                res.render('signup', { message: 'error' });
              } else {
                res.redirect('/login')
              }
            })
          })
          .catch(err => console.log(err))
      }
    })
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(error => {
    if (error) {
      next(error);
    } else {
      res.redirect('/');
    }
  })
});



module.exports = router;

