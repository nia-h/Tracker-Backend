const express = require("express");
const myRouter = express.Router();

const { User } = require("./models/models");
const medsController = require("./controllers/medsController.js");
const userController = require("./controllers/userController");

myRouter.get("/", (req, res) =>
  res.status(201).json("Hello, if you see this message that means your backend is up and running successfully.")
);

// myRouter.post("/addToSchedule", medsController.addToSchedule, (req, res) => {
//   const data = res.locals;

//   res.json(data);
// });

myRouter.post("/createRegimen", medsController.createRegimen, (req, res) => {
  const data = res.locals;

  res.json(data);
});

myRouter.get("/:userId/fetchSchedule", medsController.fetchSchedule, (req, res) => {
  const { schedule } = res.locals;
  // console.log("myRouter schedule==>", schedule);
  res.json(schedule);
});

myRouter.post("/updateSchedule", medsController.updateSchedule, (req, res) => {
  const data = res.locals;

  res.json(data);
});

myRouter.post("/register", userController.register, medsController.createRegimen, (req, res) => {
  const data = res.locals;
  res.json(data);
});

myRouter.post("/login", userController.login, (req, res) => {
  const user = res.locals;
  //console.log('med==>', med);
  res.json(user);
  // res.render('view');
});

myRouter.post("/checkItem", medsController.checkItem, (req, res) => {
  const data = res.locals;
  //console.log('med==>', med);
  res.json(data);
});

myRouter.post("/:userId/renewRegimen", medsController.renewRegimen, (req, res) => {
  const data = res.locals;
  //console.log('med==>', med);
  res.json(data);
});
// router.get('/auth', cookieController.verifyCookie, (req, res) =>
//   res.status(200).json(res.locals)
// );

// router.get('/logout', cookieController.logout, (req, res) => res.sendStatus(200));

module.exports = myRouter;
