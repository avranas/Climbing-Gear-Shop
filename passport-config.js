if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
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
  //const findOrCreate()

  const handleOauthResponse = async (
    externalWebsite,
    id,
    email,
    name,
    done
  ) => {
    try {
      let whereCondition = {};
      switch (externalWebsite) {
        case "github":
          whereCondition = { githubId: id };
          break;
        case "google":
          whereCondition = { googleId: id };
          break;
      }
      //If a user with this github id exists, return this user
      let userResponse = await User.findOne({
        where: whereCondition,
      });
      if (userResponse) {
        return done(null, userResponse);
      }
      /*
        If a user with this github id does not exist, I want to create a new
        user If a user with the same email already exists, return an error
      */
      userResponse = await User.findOne({
        where: { userEmail: email },
      });
      if (userResponse) {
        return done(null, false);
      }
      const response = await User.findOrCreate({
        where: whereCondition,
        defaults: {
          name: name,
          userEmail: email,
          rewardsPoints: 0,
        },
      });
      return done(null, response[0]);
    } catch (err) {
      console.log(err);
      return done(err, false);
    }
  };

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        await handleOauthResponse(
          "github",
          profile.id,
          profile.emails[0].value,
          profile.displayName,
          done
        );
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        await handleOauthResponse(
          "google",
          profile.id,
          profile.email,
          profile.displayName,
          done
        );
        console.log("find user here");
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
