const mongoose = require("mongoose");
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

const socialUserSchema = new Schema({
  socialId: {
    type: String,
    required: true,
    unique: true,
  },
});

const courseSchema = new Schema({
  med: String,
  time: String,
  taken: { type: Boolean, default: false },
});

const regimenSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },

  lastActiveDay: {
    //to be updated the first visit of each new day
    type: String,
    // `Date.now()` returns the current unix timestamp as a number
    default: new Date().toDateString(),
  },

  // schedule: [
  //   { med: String, time: String, taken: { type: Boolean, default: false } },
  // ],
  // schedule: { type: Map, of: Object },

  schedules: {
    type: Map,
    of: [courseSchema],
  },
});

const User = mongoose.model("user", userSchema);
const Regimen = mongoose.model("regimen", regimenSchema);
const Course = mongoose.model("course", courseSchema);
const SocialUser = mongoose.model("socialUser", socialUserSchema);

// const DailyMedList = mongoose.model("medList", dailyMedListSchema);

// const Location = mongoose.model('locations', locationSchema);

module.exports = {
  User,
  Regimen,
  Course,
  SocialUser,
};
