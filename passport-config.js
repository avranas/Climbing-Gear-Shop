if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const passport = require("passport");
const User = require("./models/users");
const bcrypt = require("bcrypt");
const { Octokit } = require("@octokit/rest");

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
      console.log(err);
      return done(err, false);
    }
  };
  passport.use(
    new LocalStrategy(
      {
        usernameField: "userEmail",
        passwordField: "password",
      },
      authenticateUser
    )
  );
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        const response = await User.findOrCreate({
          where: { githubId: profile.id },
          defaults: {
            name: profile.displayName,
            userEmail: profile.emails[0].value,
            rewardsPoints: 0
          }
        });
        return done(null, response[0]);
      }
    )
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) =>
    done(null, await getUserById(id))
  );
};

initializePassport(
  passport,
  async (newUserEmail) =>
    await User.findOne({
      where: { userEmail: newUserEmail },
    }),
  async (newId) =>
    await User.findOne({
      where: { id: newId },
    })
);

module.exports = passport;


//TODO: Orders is fucked up. I think all are visible to each user