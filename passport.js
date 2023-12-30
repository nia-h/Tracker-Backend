const GithubStrategy = require("passport-github2").Strategy;
const passport = require("passport");
const { SocialUser, Regimen } = require("./models/models");

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    //this is the verify function that will be envoked when GitHub returns user info (profile)
    async function (accessToken, refreshToken, profile, done) {
      try {
        const existingUser = await SocialUser.findOne({ socialId: profile.id });
        if (existingUser) {
          done(null, existingUser);
        } else {
          const newUser = await new SocialUser({
            socialId: profile.id,
            username: profile.username,
            thumbnail: profile._json.avatar_url,
          }).save();

          const today = new Date().toDateString();

          const id = newUser.id;

          const data = { userId: newUser.id, lastActiveDay: today, schedules: new Map().set(today, []) };

          let regimen = await Regimen.findOne({ userId: id });
          if (!regimen) {
            regimen = await new Regimen(data).save();
          }
          done(null, newUser); // add regiman to cookie?
        }
      } catch (e) {
        console.log("error===>", e);
      }
    }
  )
);

// If sessions are being utilized, applications must set up Passport with
//          * functions to serialize a user into and out of a session.  For example, a
//          * common pattern is to serialize just the user ID into the session (due to the
//          * fact that it is desirable to store the minimum amount of data in a session).
//          * When a subsequent request arrives for the session, the full User object can
//          * be loaded from the database by ID.

passport.serializeUser((user, done) => {
  done(null, user.id); //store id in cookie  (.id is a virtual getter provided by mongoose)
});

passport.deserializeUser(async (idInCookie, done) => {
  const user = await SocialUser.findById(idInCookie);
  // console.log("deserializedUser==>", user);
  done(null, user);
});
