//require("dotenv").config();
const dotenv = require("dotenv");
dotenv.config();
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
const { BadRequestErr } = require("./Errors/badRequestErr");

const { Regimen } = require("./models/models");

async function updateAll() {
  // refactor to account for yesterday notfound (error)
  console.log("cronjob");
  let today = new Date().toDateString();
  let yesterday = getPreviousDay();
  try {
    const regimens = await Regimen.find({});
    regimens.forEach(async regimen => {
      if (regimen.schedules.get(today)) return;
      let schedule = regimen.schedules.get(yesterday);

      let newSchedule = schedule.map(course => {
        course.taken = false;
        return course;
      });
      regimen.schedules.set(today, newSchedule);
      await regimen.save();
    });
  } catch (e) {
    console.log("error==>", e);
  }
}

const cronJob = cron.schedule("0 01 05 * * *", updateAll, {
  scheduled: false,
  timezone: "Asia/Shanghai",
});
cronJob.start();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cookieSession({
    name: "MTsession",
    sameSite: "none",
    secure: true,
    keys: ["medsTraker"],
    maxAge: 24 * 60 * 60 * 1000,
  })
); //keys are for encryption

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
    origin: process.env.CLIENT_URL,
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

//catch-all route handler
app.use((req, res) => {
  res.sendStatus(404);
});

// app.use((err, req, res, next) => {
//   const defaultErr = {
//     log: "Express error handler caught unknown middleware error",
//     status: 500,
//     message: { err: "An error occurred" },
//   };

//   const errorObj = Object.assign(defaultErr, err);

//   return res.status(errorObj.status).json(errorObj.message);
// });

// app.use(function (err, req, res, next) {
//   res.status(err.status || 500);
//   res.render("error", {
//     message: err.message,
//     error: err,
//   });
// });

app.use((err, req, res, next) => {
  // in prod, don't use console.log or console.err because
  // it is not async
  console.log("application-level error-handler called");
  console.error(err);

  if (err instanceof BadRequestErr) {
    res.status(400).send(err.message);
    return;
  }

  res.status(500).send("server internal error, check server log for detail");
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

const getPreviousDay = (date = new Date()) => {
  const previous = new Date(date.getTime());
  previous.setDate(date.getDate() - 1);

  return previous.toDateString();
};
