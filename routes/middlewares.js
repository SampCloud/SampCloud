const loginCheck = () => {
  return (req, res, next) => {

    if (req.session.user) {
      next();
    } else {
      res.redirect('/login');
    }
  }
}

const isSinger = () => {
  return (req, res, next) => {
    if (req.session.user.role === "singer") {
      next();
    } else {
      res.redirect('/login');
    }
  }
}

const isProducer = () => {
  return (req, res, next) => {
    if (req.session.user.role === "producer") {
      next();
    } else {
      res.redirect('/login');
    }
  }
}

module.exports = {
  loginCheck,
  isSinger,
  isProducer
}

