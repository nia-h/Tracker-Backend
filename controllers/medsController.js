const Axios = require('axios');

const { MedSchedule } = require('../models/models');

const medsController = {};

medsController.addToSchedule = async (req, res, next) => {
  const data = req.body;

  try {
    //first check if one exists
    let medSchedule = await MedSchedule.findOneAndUpdate(
      { userId: data.userId },
      { $push: { schedule: { $each: data.schedule } } },
      { new: true }
    );
    if (!medSchedule) {
      medSchedule = await new MedSchedule(data).save();
    }
    res.locals = medSchedule;
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
      throw Error('schedule not found!');
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
    res.status(500).send('Sorry, invalid user requested.');
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
