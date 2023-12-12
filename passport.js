const GithubStrategy = require("passport-github2").Strategy;
const passport = require("passport");

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },

    // function (accessToken, refreshToken, profile, done) {
    //   User.findOrCreate({ githubId: profile.id }, function (err, user) {
    //     // add DB methods here
    //     return done(err, user);
    //   });
    // }

    function (accessToken, refreshToken, profile, cb) {
      cb(null, profile);
    }
  )
);

//do not need the following is using mongoDB?
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});
