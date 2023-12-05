const Axios = require("axios");

const { Regimen } = require("../models/models");

const { isSameDay, parseISO } = require("date-fns");

const medsController = {};

medsController.updateSchedule = async (req, res, next) => {
  //We do want to save to the db than update UI?
  const { userId, schedule, today } = req.body;
  console.log("schedule==>", schedule);

  const schedules = new Map().set(today, schedule);

  try {
    let regimen = await Regimen.findOne({ userId });

    if (regimen == null) {
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
  const data = req.body;

  try {
    //first check if one exists
    // let medSchedule = await MedSchedule.findOneAndUpdate(
    //   { userId: data.userId },
    //   { $push: { schedule: { $each: data.schedule } } },
    //   { new: true }
    // );
    // if (!medSchedule) {
    //   medSchedule = await new MedSchedule(data).save();
    // }
    const regimen = await new Regimen(data).save();
    res.locals = regimen;
    return next();
  } catch (error) {
    console.log(error);
  }
};

medsController.checkItem = async (req, res, next) => {
  const { userId, nextSchedule } = req.body;

  try {
    let medSchedule = await MedSchedule.findOneAndUpdate(
      { userId: userId },
      { $set: { schedule: nextSchedule } },
      // [{ $set: { 'schedule.$.taken': { $eq: [false, 'schedule.$.taken'] } } }],
      { new: true }
    );
    if (!medSchedule) {
      throw Error("schedule not found!");
    }

    res.locals = medSchedule;
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
  const { lastActiveAt, newSchedule } = req.body;

  try {
    let regimen = await Regimen.findOne({ userId });

    regimen.lastActiveAt = lastActiveAt;

    regimen.schedules.set(lastActiveAt, newSchedule);
    const renewedRegiman = await regimen.save();
    // await regimen.save();
    // const renewedRegiman = await Regimen.findOne({
    //   userId: "6534551cee9aec8785693bz0",
    // });

    // if (!medSchedule) {
    //   medSchedule = await new MedSchedule(data).save();
    // }
    res.locals = renewedRegiman;
    return next();
  } catch (e) {
    console.log(e);
  }
};

module.exports = medsController;
