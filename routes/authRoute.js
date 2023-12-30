const router = require("express").Router();
const passport = require("passport");

~router.get("/github", passport.authenticate("github", { scope: ["profile", "email"] }));

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

// router.get("/githubRedirect", (req, res, next) => {
//   res.redirect(process.env.CLIENT_URL);
// });

// // passport.authenticate() - Applies the `name`ed strategy (or strategies) to the incoming request, in
// //          * order to authenticate the request.  If authentication is successful, the user
// //          * will be logged in and populated at `req.user` and a session will be
// //        * established by default.  If authentication fails, an unauthorized response
//          * will be sent.
// app.get('/protected', function(req, res, next) {
//   *       passport.authenticate('local', function(err, user, info, status) {
//   *         if (err) { return next(err) }
//   *         if (!user) { return res.redirect('/signin') }
//   *         res.redirect('/account');
//   *       })(req, res, next);
//   *     });
//   *
//   * Note that if a callback is supplied, it becomes the application's
//   * responsibility to log-in the user, establish a session, and otherwise perform
//   * the desired operations.
// router.get(
//   "/github/callback",
//   passport.authenticate("github", {
//     successRedirect: CLIENT_URL,
//     failureRedirect: "/login/failed",
//   })
// );

router.get("/github/callback", (req, res, next) => {
  passport.authenticate("github", function (err, user, info, status) {
    console.log("err==>", err);
    console.log("user==>", user);
    console.log("info==>", info);
    console.log("status==>", status);
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/dfdfjdkfjdfjdkjf");
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      //If Successful
      // return res.status(302).json({ redirectUrl: "/" });
      return res.status(302).redirect(process.env.CLIENT_URL);
    });
    // res.redirect(CLIENT_URL);
  })(req, res, next);
});

module.exports = router;
