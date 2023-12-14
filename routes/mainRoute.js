const express = require("express");
const mainRouter = express.Router();
const medsController = require("../controllers/medsController.js");
const userController = require("../controllers/userController");

mainRouter.get("/", (req, res) =>
  res.status(201).json("Hello, if you see this message that means your backend is up and running successfully.")
);

mainRouter.get(
  "/:socialId/socialUserLogin",
  userController.socialUserLogin,
  userController.register,
  medsController.createRegimen,

  (req, res) => {
    const data = res.locals;
    res.json(data);
  }
);

mainRouter.post("/createRegimen", medsController.createRegimen, (req, res) => {
  const data = res.locals;
  f;
  res.json(data);
});

mainRouter.get("/:userId/fetchSchedule", medsController.fetchSchedule, (req, res) => {
  const { schedule } = res.locals;
  res.json(schedule);
});

mainRouter.post("/updateSchedule", medsController.updateSchedule, (req, res) => {
  const data = res.locals;

  res.json(data);
});

mainRouter.post("/register", userController.register, medsController.createRegimen, (req, res) => {
  const data = res.locals;
  res.json(data);
});

mainRouter.post("/login", userController.login, (req, res) => {
  const user = res.locals;
  res.json(user);
});

mainRouter.post("/checkItem", medsController.checkItem, (req, res) => {
  const data = res.locals;

  res.json(data);
});

// router.get('/auth', cookieController.verifyCookie, (req, res) =>
//   res.status(200).json(res.locals)
// );

// router.get('/logout', cookieController.logout, (req, res) => res.sendStatus(200));

module.exports = mainRouter;
