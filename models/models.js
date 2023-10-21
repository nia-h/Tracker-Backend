const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Client and Host Model
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

const medScheduleSchema = new Schema({
  userId: {
    type: String,
    // required: true,
  },

  schedule: Schema.Types.Mixed,
  // medication: {
  //   type: String,
  //   required: true,
  // },
  // slots: [String],
});

// const dailyMedListSchema = new Schema({
//   date: Date,

//   userId: {
//     type: String,
//     required: true,
//   },

//   medication: {
//     type: String,
//     required: true,
//   },
//   slots: [Schema.Types.Mixed],
// });

// const bookingSchema = new Schema({
//   clientUsername: {
//     type: String,
//     required: true,
//   },
//   hostUsername: {
//     type: String,
//     required: true,
//   },
//   startDate: {
//     type: Date,
//     required: true,
//   },
//   endDate: {
//     type: Date,
//     required: true,
//   },

//   location: {
//     type: String,
//     required: true,
//   },
// });

// const locationSchema = new Schema({
//   hostName: {
//     type: String,
//     required: true,
//   },
//   address: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   options: {
//     type: String,
//     required: true,
//   },
//   size: {
//     type: Number,
//     required: true,
//   },
//   coordinates: {
//     lat: Number,
//     lng: Number,
//   },
// });

const User = mongoose.model('user', userSchema);
const MedSchedule = mongoose.model('medSchedule', medScheduleSchema);
// const Location = mongoose.model('locations', locationSchema);

module.exports = {
  // Location,
  User,
  MedSchedule,
  // DailyMedList,
};
