const express = require("express");
const mainRouter = express.Router();
const medsController = require("../controllers/medsController.js");
const userController = require("../controllers/userController");
const jwt = require("jsonwebtoken");
const { BadRequestErr } = require("../Errors/badRequestErr");

const checkLoggedIn = function (req, res, next) {
  try {
    if (req.body.token) {
      //  (Synchronous) If a callback is not supplied, function acts synchronously. Returns the payload decoded if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will throw the error.
      req.apiUser = jwt.verify(req.body.token, process.env.JWTSECRET);
      next();
    } else if (req.user) {
      next();
    } else {
      return next(
        BadRequestErr.create({
          controller: "",
          method: "checkLoggedIn",
          err: "User appears to be not logged in.",
        })
      );
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

mainRouter.get("/", (req, res) =>
  res.status(201).json("Hello, if you see this message that means your backend is up and running successfully.")
);

mainRouter.post("/fetchSchedule", checkLoggedIn, medsController.fetchSchedule, (req, res) => {
  const { schedule } = res.locals;
  res.json(schedule);
});

mainRouter.post("/updateSchedule", checkLoggedIn, medsController.updateSchedule, (req, res) => {
  const data = res.locals;

  res.json(data);
});

mainRouter.post("/register", userController.register, medsController.createRegimen, (req, res) => {
  const data = res.locals;
  res.json(data); // do not really need to send it back
});

mainRouter.post("/login", userController.login, (req, res) => {
  const user = res.locals;
  res.json(user);
});

mainRouter.post("/checkOrDeleteCourse", checkLoggedIn, medsController.checkOrDeleteCourse, (req, res) => {
  const data = res.locals;

  res.json(data);
});

// router.get('/auth', cookieController.verifyCookie, (req, res) =>
//   res.status(200).json(res.locals)
// );

// router.get('/logout', cookieController.logout, (req, res) => res.sendStatus(200));

module.exports = mainRouter;
