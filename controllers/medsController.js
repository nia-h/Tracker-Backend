const Axios = require('axios');

const { User, MedSchedule } = require('../models/models');

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

    console.log('medSchedule==>', medSchedule);

    res.locals = medSchedule;
    return next();
  } catch (error) {
    console.log(error);
  }
};

medsController.checkItem = async (req, res, next) => {
  const { userId, itemId } = req.body;
  console.log('userId==>', userId);
  console.log('itemId==>', itemId);
  try {
    let medSchedule = await MedSchedule.findOneAndUpdate(
      { userId: userId, 'schedule._id': itemId },
      { $set: { 'schedule.$.taken': true } },
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

medsController.getMedListByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  console.log('userId  from param==>', userId);
  // console.log('reached getMedListByuserId controller');
  try {
    const data = await MedSchedule.findOne({ userId });
    //res.header("Cache-Control", "max-age=10").json(posts)
    res.locals = data;
    return next();
  } catch (e) {
    res.status(500).send('Sorry, invalid user requested.');
  }
};

module.exports = medsController;
