require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT;
const app = express();
const mainRoute = require("./routes/mainRoute");
const authRoute = require("./routes/authRoute");
const passport = require("passport");
const passportSetup = require("./passport"); //execute the code so the strategy/setup is associated with the passport object;
const cookieSession = require("cookie-session");
const cron = require("node-cron");
const Axios = require("axios");

const { Regimen } = require("./models/models");

async function updateAll() {
  console.log("updatAll called");
  let today = new Date().toDateString();
  let yesterday = getPreviousDay();
  try {
    const regimens = await Regimen.find({});
    regimens.forEach(async regimen => {
      if (regimen.schedules.get(today)) return;
      let schedule = regimen.schedules.get(yesterday);
      console.log("schedule==>", schedule);

      let newSchedule = schedule.map(course => {
        course.taken = false;
        return course;
      });
      console.log("newSchedule==>", newSchedule);
      regimen.schedules.set(today, newSchedule);
      await regimen.save();
    });
  } catch (e) {
    console.log("error==>", e);
  }
}

const cronJob = cron.schedule("0 0 0 * * *", updateAll, {
  scheduled: false,
  timezone: "Asia/Shanghai",
});
cronJob.start();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieSession({ name: "MTsession", keys: ["medsTraker"], maxAge: 24 * 60 * 60 * 1000 })); //keys are for encryption

app.use(function (request, response, next) {
  // This is a walkaround see below post
  //https://stackoverflow.com/questions/72375564/typeerror-req-session-regenerate-is-not-a-function-using-passport

  if (request.session && !request.session.regenerate) {
    request.session.regenerate = cb => {
      cb();
    };
  }
  if (request.session && !request.session.save) {
    request.session.save = cb => {
      cb();
    };
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use("/", mainRoute);

app.use("/auth", authRoute);

// Mongo Connection
mongoose
  .connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Meds-Tracker",
  })
  .then(() => {
    console.log("Connected to Mongo!");
  })
  .catch(err => {
    console.error("Error connecting to Mongo", err);
  });

app.use((req, res) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };

  const errorObj = Object.assign(defaultErr, err);

  return res.status(errorObj.status).json(errorObj.message);
});

// app.use(function (err, req, res, next) {
//   res.status(err.status || 500);
//   res.render("error", {
//     message: err.message,
//     error: err,
//   });
// });

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

const getPreviousDay = (date = new Date()) => {
  const previous = new Date(date.getTime());
  previous.setDate(date.getDate() - 1);

  return previous.toDateString();
};
