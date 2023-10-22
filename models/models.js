const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Client and Host Model
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
});

const medScheduleSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },

  schedule: [
    { med: String, time: String, taken: { type: Boolean, default: false } },
  ],
});

const dailyMedListSchema = new Schema({
  //new Date(1697899238992).getDate()
  date: {
    type: Date,
    // `Date.now()` returns the current unix timestamp as a number
    default: Date.now,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },

  schedule: [
    { med: String, time: String, taken: { type: Boolean, default: false } },
  ],
});

const User = mongoose.model('user', userSchema);
const MedSchedule = mongoose.model('medSchedule', medScheduleSchema);
const DailyMedList = mongoose.model('dailymedList', dailyMedListSchema);

// const Location = mongoose.model('locations', locationSchema);

module.exports = {
  User,
  MedSchedule,
  DailyMedList,
};
