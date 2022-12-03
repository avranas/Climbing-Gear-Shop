if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const passport = require("passport");
const User = require("./models/users");
const bcrypt = require("bcrypt");

const initializePassport = async (passport, getUserByEmail, getUserById) => {
  const authenticateUser = async (userEmail, password, done) => {
    try {
      const user = await getUserByEmail(userEmail);
      if (user == null) {
        return done(null, false);
      }
      //If the user exists and doesn't have a password, that means it was
      //Created using oauth. Return an error here
      if (!user.password) {
        return done(null, false)
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
        try {
          //If a user with this github id exists, return this user
          let userResponse = await User.findOne({
            where: { githubId: profile.id }
          });
          if (userResponse) {
            return done(null, userResponse);
          }
          //If a user with this github id does not exist, I want to create a new user
          //If a user with the same email already exists, return an error
          const gitHubEmail = profile.emails[0].value;
          userResponse = await User.findOne({
            where: {userEmail : gitHubEmail}
          })
          if (userResponse) {
            return done(null, false);
          }
          const response = await User.findOrCreate({
            where: { githubId: profile.id },
            defaults: {
              name: profile.displayName,
              userEmail: gitHubEmail,
              rewardsPoints: 0
            }
          });
          return done(null, response[0]);
          
        } catch (err) {
          console.log(err);
          return done(err, false);
        }
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


//TODO: Improve back end error handling by removing all try catch blocks from
    //middleware functions. This might break things so be careful
//TODO: Oauth with google?
//TODO: Notification after login with oauth? Is this possible? :(