const checkIfLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).send("You need to be logged in to do that");
  }
}

const checkIfNotLoggedIn = (req, res, next) => {
  if (!req.user) {
    next();
  } else {
    res.status(401).send("You need to be logged out do that");
  }
}

const checkIfLoggedInAsAdmin = (req, res, next) => {
  if (!req.user || req.user.username !== 'admin') {
    res.status(401).send("You need to be logged in as an admin to do that");
  }
  next();
}

module.exports = { checkIfLoggedIn, checkIfNotLoggedIn, checkIfLoggedInAsAdmin };
