const Axios = require("axios");

const { Regimen } = require("../models/models");

const { isSameDay, parseISO } = require("date-fns");

const medsController = {};

medsController.updateSchedule = async (req, res, next) => {
  const { userId, addedCourses } = req.body;

  try {
    let regimen = await Regimen.findOne({ userId });
    if (regimen == null) return;

    regimen.schedules.get(regimen.lastActiveDay).push(...addedCourses);
    console.log(regimen.schedules.get(regimen.lastActiveDay));

    const updatedRegiman = await regimen.save();

    res.locals = updatedRegiman.schedules.get(regimen.lastActiveDay);
    return next();
  } catch (error) {
    console.log(error);
  }
};

medsController.createRegimen = async (req, res, next) => {
  const { _id: userId } = res.locals.user;
  const today = new Date().toDateString();

  const data = { userId, lastActiveDay: today, schedules: new Map().set(today, []) };

  try {
    let regimen = await Regimen.findOne({ userId });
    if (!regimen) {
      regimen = await new Regimen(data).save();
      console.log("regimen right after creation==>", regimen);
    }
    res.locals.regimen = regimen;
    return next();
  } catch (error) {
    console.log(error);
  }
};

medsController.checkOrDeleteCourse = async (req, res, next) => {
  const { apiUser } = req;
  console.log("apiUser==>", apiUser);

  const { nextSchedule } = req.body;

  console.log("nextSchedule==>", nextSchedule);

  const { _id } = req.apiUser;

  console.log("_id==>", _id);

  try {
    let regimen = await Regimen.findOne({ userId: _id });

    regimen.schedules.set(regimen.lastActiveDay, nextSchedule);

    const updatedRegiman = await regimen.save();

    res.locals = updatedRegiman;
    return next();
  } catch (error) {
    console.log(error);
  }
};

medsController.fetchSchedule = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const regimen = await Regimen.findOne({ userId });

    // let schedule = regimen.schedules.get(regimen.lastActiveDay);

    let today = new Date().toDateString();

    if (!isSameDay(new Date(today), new Date(regimen.lastActiveDay))) {
      regimen.lastActiveDay = today;

      await regimen.save();
    }
    //console.log("regimen===>, " regimen)  //need testing here to see if there is a problem of "stale data"
    res.locals.schedule = regimen.schedules.get(regimen.lastActiveDay);
    return next();
  } catch (e) {
    console.log(e);
  }
};

module.exports = medsController;
