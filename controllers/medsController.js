const Axios = require("axios");

const { Regimen } = require("../models/models");

const medsController = {};

medsController.updateSchedule = async (req, res, next) => {
  // const data = req.body;

  try {
    let regimen = await Regimen.findOne({ userId: "6534551cee9aec8785693bz0" });

    let key = "1234567";
    regimen.schedule.set(key, [
      { med: "abc", time: "11:12", taken: true, _id: "656d9bec931d3169f1aac129" },
      {
        med: "xyz",
        time: "22:11",
        taken: false,
        _id: "656d9bec931d3169f1aac12a",
      },
    ]);
    const updatedRegiman = await regimen.save();
    // await regimen.save();
    // const updatedRegiman = await Regimen.findOne({
    //   userId: "6534551cee9aec8785693bz0",
    // });

    // if (!medSchedule) {
    //   medSchedule = await new MedSchedule(data).save();
    // }
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

medsController.getScheduleByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const data = await MedSchedule.findOne({ userId });

    res.locals = data;
    return next();
  } catch (e) {
    res.status(500).send("Sorry, invalid user requested.");
  }
};

medsController.renewSchedule = async (req, res, next) => {
  const userId = req.params.userId;
  const newProfile = req.body;

  try {
    const data = await MedSchedule.findOneAndReplace({ userId }, newProfile);
    //res.header("Cache-Control", "max-age=10").json(posts)
    res.locals = data;
    return next();
  } catch (e) {
    console.log(e);
  }
};

module.exports = medsController;
