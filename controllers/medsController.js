const Axios = require("axios");

const { Regimen } = require("../models/models");

const { isSameDay, parseISO } = require("date-fns");

const medsController = {};

medsController.updateSchedule = async (req, res, next) => {
  //We do want to save to the db than update UI?
  const { userId, schedule, today } = req.body;
  console.log("schedule==>", schedule);

  try {
    let regimen = await Regimen.findOne({ userId }); // split controllers into  smaller ones - locate/find regimen -> update ->..._. next...

    if (regimen == null) {
      const schedules = new Map().set(today, schedule);

      regimen = await new Regimen({
        userId,
        lastActiveDay: today,
        schedules,
      }).save();
    } else {
      isSameDay(new Date(parseInt(regimen.lastActiveDay)), today)
        ? regimen.schedules.get(regimen.lastActiveDay).push(...schedule)
        : regimen.schedules.set(String(today), schedule);
    }
    const updatedRegiman = await regimen.save();

    res.locals = updatedRegiman;
    return next();
  } catch (error) {
    console.log(error);
  }
};

medsController.createRegimen = async (req, res, next) => {
  // chain a login controller?
  console.log("hit createREgimen controller");

  // const data = req.body;
  console.log("res.locals==>", res.locals);
  const { _id: userId } = res.locals;
  const { today } = req.body;

  const data = { userId, lastActiveDay: today, schedules: new Map().set(String(today), []) };

  try {
    const regimen = await new Regimen(data).save();
    res.locals = regimen;
    return next();
  } catch (error) {
    console.log(error);
  }
};

medsController.checkItem = async (req, res, next) => {
  console.log("hit checkItem controller");
  const { userId, nextSchedule } = req.body;

  try {
    let regimen = await Regimen.findOne({ userId });

    regimen.schedules.set(regimen.lastActiveDay, nextSchedule);

    const updatedRegiman = await regimen.save();

    res.locals = updatedRegiman;
    return next();
  } catch (error) {
    console.log(error);
  }
};

medsController.getRegimenByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const data = await Regimen.findOne({ userId });

    res.locals = data;
    return next();
  } catch (e) {
    res.status(500).send("Sorry, invalid user requested.");
  }
};

medsController.renewRegimen = async (req, res, next) => {
  const userId = req.params.userId;
  const { lastActiveDay, schedule } = req.body;

  console.log("lastActiveDay==>", lastActiveDay);

  try {
    let regimen = await Regimen.findOne({ userId });

    regimen.lastActiveDay = lastActiveDay;

    regimen.schedules.set(String(lastActiveDay), schedule);
    const renewedRegiman = await regimen.save();
    // await regimen.save();
    // const renewedRegiman = await Regimen.findOne({
    //   userId: "6534551cee9aec8785693bz0",
    // });

    // if (!medSchedule) {
    //   medSchedule = await new MedSchedule(data).save();
    // }
    // console.log("renewedRegiman==>", renewedRegiman);
    res.locals = renewedRegiman;

    return next();
  } catch (e) {
    console.log(e);
  }
};

module.exports = medsController;
