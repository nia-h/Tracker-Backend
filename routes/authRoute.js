const router = require("express").Router();
const passport = require("passport");

const CLIENT_URL = "http://192.168.2.101:5173";

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

// router.get("/logout", async (req, res, next) => {
//   req.logout(err => {
//     // this method (.logout) is from passport
//     if (err) {
//       console.log("logout err==>", err);
//       return next(err);
//     }
//   });
//   res.status(200).json("logout complete");
// });

// router.post("/logout", (req, res, next) => {
//   req.logout(function (err) {
//     if (err) {
//       return next(err);
//     }
//     // res.redirect("http://localhost:5173/");
//     res.status(200).json("logout complete");
//   });
// });

router.post("/logout", async (req, res, next) => {
  console.log("auth/logout route handler");
  console.log("req.user==>", req.user);
  req.logout(req.user, function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json("social logout complete");
  });
});
// router.post("/logout", (req, res, next) => {
//   req.logout(() => {
//     console.log("logout called");
//   });

//
// });

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
