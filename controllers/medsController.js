const Axios = require("axios");

const { Regimen } = require("../models/models");

const { isSameDay, parseISO } = require("date-fns");

const medsController = {};

medsController.updateSchedule = async (req, res, next) => {
  //We do want to save to the db than update UI?
  const { userId, addedCourses } = req.body;

  try {
    let regimen = await Regimen.findOne({ userId }); // split controllers into  smaller ones - locate/find regimen -> update ->..._. next...

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
    console.log("updated Regiman==>", updatedRegiman);
    return;

    res.locals = updatedRegiman;
    return next();
  } catch (error) {
    console.log(error);
  }
};

medsController.fetchSchedule = async (req, res, next) => {
  // will need to update regimen and send back schedule
  const userId = req.params.userId;
  try {
    const regimen = await Regimen.findOne({ userId });

    let schedule = regimen.schedules.get(regimen.lastActiveDay);

    // (course => {
    //   course.taken = false;
    //   delete course.time;
    //   return course;
    // });

    // const myArray = [
    //   { name: "bob", _id: ObjectId("656f21cef75acffd204c23ba") },
    //   { name: "jerry", _id: 2 },
    // ];

    // const my2Array = [...myArray].map(e => {
    //   delete e._id;
    //   return e;
    // });
    // console.log(my2Array);

    let today = Date.now();

    if (!isSameDay(new Date(today), new Date(parseInt(regimen.lastActiveDay)))) {
      let newSchedule = [];

      // const newSchedule = schedule.map(({ _id, ...item }) => item);
      schedule.forEach(course => {
        let newCourse = {};
        newCourse.taken = false;
        newCourse.med = course.med;
        newCourse.time = course.time;

        newSchedule.push(newCourse);
      });

      // console.log("new schedule==>", newSchedule);
      regimen.lastActiveDay = today;
      regimen.schedules.set(today.toISOString(), newSchedule);
      await regimen.save();

      res.locals.schedule = regimen.schedules.get(String(today));
      return next();
    } else {
      res.locals.schedule = schedule;
      return next();
    }
  } catch (e) {
    console.log(e);
  }
};

medsController.renewRegimen = async (req, res, next) => {
  const userId = req.params.userId;
  const regimen = res.locals;

  console.log("lastActiveDay==>", lastActiveDay);

  try {
    let regimen = await Regimen.findOne({ userId });

    regimen.lastActiveDay = lastActiveDay;

    regimen.schedules.set(String(lastActiveDay), schedule); // extract a new function, eliminating duplicated code
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
