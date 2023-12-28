const router = require("express").Router();
const passport = require("passport");

const CLIENT_URL = "http://localhost:5173";

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successful",
      user: req.user,
    });
  } else {
    res.json({ user: null });
  }
});

router.get("/login/failed", (req, res) => {
  console.log("login failed");
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get("/logout", (req, res, next) => {
  req.logout(err => {
    // this method (.logout) is from passport
    if (err) {
      console.log("logout err==>", err);
      return next(err);
    }
  });
  res.status(200).json("logout complete");
});

router.get("/githubRedirect", (req, res, next) => {
  res.redirect(CLIENT_URL);
});

router.get("/github", passport.authenticate("github", { scope: ["profile", "email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

module.exports = router;
