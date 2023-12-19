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

    async function (accessToken, refreshToken, profile, done) {
      console.log("hit verify cb");
      try {
        const existingUser = await SocialUser.findOne({ socialId: profile.id });
        if (existingUser) {
          // console.log("exisitng User==>", existingUser);
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
            console.log("regimen right after creation==>", regimen);
          }
          done(null, newUser); // add regiman to cookie?
        }
      } catch (e) {
        console.log("error===>", e);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); //store id in cookie  (.id is a virtual getter provided by mongoose)
});

passport.deserializeUser(async (idInCookie, done) => {
  const user = await SocialUser.findById(idInCookie);
  console.log("deserializedUser==>", user);
  done(null, user);
});
