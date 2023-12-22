const Axios = require("axios");

const { Regimen } = require("../models/models");

const { isSameDay } = require("date-fns");

const { BadRequestErr } = require("../Errors/badRequestErr");

const medsController = {};

// const createErr = errInfo => {
//   const { method, err } = errInfo;
//   return {
//     log: `medsController.${method} ERROR: ${typeof err === "object" ? JSON.stringify(err) : err}`,
//     message: `Error occurred in medsController.${method}. Check server logs for more details.`,
//   };
// };

medsController.updateSchedule = async (req, res, next) => {
  const { addedCourses } = req.body;

  if (!addedCourses)
    return next(
      BadRequestErr.create({
        controller: "medsController",
        method: "updateSchedule",
        err: "payload (addedCourses) appears to be missing.",
      })
    );

  let id;

  if (req.apiUser) id = req.apiUser.id;

  if (req.user) id = req.user.id;

  try {
    let regimen = await Regimen.findOne({ userId: id });
    if (regimen == null) return;

    regimen.schedules.get(regimen.lastActiveDay).push(...addedCourses);

    const updatedRegiman = await regimen.save();

    res.locals = updatedRegiman.schedules.get(regimen.lastActiveDay);
    return next();
  } catch (error) {
    console.log(error);
  }
};

medsController.createRegimen = async (req, res, next) => {
  const { id: userId } = res.locals.user;
  const today = new Date().toDateString();

  const data = { userId, lastActiveDay: today, schedules: new Map().set(today, []) };

  try {
    let regimen = await Regimen.findOne({ userId });
    if (!regimen) {
      regimen = await new Regimen(data).save();
    }
    res.locals.regimen = regimen;
    return next();
  } catch (error) {
    console.log(error);
  }
};

medsController.checkOrDeleteCourse = async (req, res, next) => {
  const { nextSchedule } = req.body;

  let id;

  if (req.apiUser) id = req.apiUser.id;

  if (req.user) id = req.user.id;

  try {
    let regimen = await Regimen.findOne({ userId: id });

    regimen.schedules.set(regimen.lastActiveDay, nextSchedule);

    const updatedRegiman = await regimen.save();

    res.locals = updatedRegiman;
    return next();
  } catch (error) {
    console.log(error);
  }
};

medsController.fetchSchedule = async (req, res, next) => {
  const user = req.user ? req.user : req.apiUser;

  try {
    const regimen = await Regimen.findOne({ userId: user.id });

    let today = new Date().toDateString();

    if (!isSameDay(new Date(today), new Date(regimen.lastActiveDay))) {
      regimen.lastActiveDay = today;

      await regimen.save();
    }
    res.locals.schedule = regimen.schedules.get(regimen.lastActiveDay);
    return next();
  } catch (e) {
    console.log(e);
  }
};

module.exports = medsController;
