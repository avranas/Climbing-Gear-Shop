if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const LocalStrategy = require('passport-local').Strategy
const passport = require('passport');
const User = require('./models/users');
const bcrypt = require('bcrypt');

const initializePassport = async (passport, getUserByEmail, getUserById) => {
  const authenticateUser = async (userEmail, password, done) => {
    try {
      const user = await getUserByEmail(userEmail);
      if (user == null) {
        return done(null, false);
      }
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      console.log(err)
      return done(err, false);
    }
  }
  passport.use(new LocalStrategy({
    usernameField: 'userEmail',
    passwordField: 'password'
  }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => done(null, await getUserById(id)));
};

initializePassport(passport,
  async newUserEmail => await User.findOne({
    where: { userEmail: newUserEmail }
  }),
  async newId => await User.findOne({
    where: { id: newId }
  })
);

module.exports = passport;
