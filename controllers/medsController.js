const Axios = require('axios');

const { MedEntry } = require('../models/models');

const { User, MedSchedule } = require('../models/models');

const medsController = {};

medsController.addToSchedule = async (req, res, next) => {
  const data = req.body;
  console.log('data==>', data);
  //console.dir(data);
  //res.json('this is a test')

  try {
    //first check if one exists
    let medSchedule = await MedSchedule.findOneAndUpdate(
      { userId: data.userId },
      { $push: { schedule: { $each: data.schedule } } },
      { new: true }
    );
    console.log('should be null==>', medSchedule);
    if (!medSchedule) {
      medSchedule = await new MedSchedule(data).save();
    }

    console.log(medSchedule);

    // if (medScheduleDoc) {
    //   medScheduleDoc.schedule.push(data.schedule);

    //   // Update document
    //   await medScheduleDoc.save();

    // console.log('medScheduleDoc after push==>', medScheduleDoc);
    // } else {
    //   medScheduleDoc = await new MedSchedule(data).save();
    // }
    // medScheduleDoc = await MedSchedule.findOne({ userId: data.userId });
    // console.log('medScheduleDoc after push==>', medScheduleDoc);
    res.locals = 'testing';
    return next();
  } catch (error) {
    console.log(error);
  }
};

medsController.getMedListByEmail = async (req, res, next) => {
  console.log('req.params==>', req.params);

  try {
    let userDoc = await User.findOne({ email: req.params.email });
    let medList = await MedEntry.find({ userId: userDoc._id });
    //res.header("Cache-Control", "max-age=10").json(posts)
    res.locals = medList;
    return next();
  } catch (e) {
    res.status(500).send('Sorry, invalid user requested.');
  }
};

module.exports = medsController;
