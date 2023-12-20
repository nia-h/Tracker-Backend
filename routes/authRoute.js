const router = require("express").Router();
const passport = require("passport");

const CLIENT_URL = "http://localhost:5173/";

router.get("/login/success", (req, res) => {
  console.log("hit login/success");
  if (req.user) {
    console.log("req.user==>", req.user);
    res.status(200).json({
      success: true,
      message: "successful",
      user: req.user,
      //   cookies: req.cookies        // or JWT
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
    if (err) {
      console.log("logout err==>", err);
      return next(err);
    }
  }); // this method is from passport
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
