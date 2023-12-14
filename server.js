// require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT;
const app = express();
const mainRoute = require("./routes/mainRoute");
const authRoute = require("./routes/authRoute");
const passport = require("passport");
const passportSetup = require("./passport"); //This is needed for auth to work even tho it seems that it is never read
const cookieSession = require("cookie-session");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieSession({ name: "MTsession", keys: ["medsTraker"], maxAge: 24 * 60 * 60 * 1000 }));

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
//   res.render('error', {
//     message: err.message,
//     error: err,
//   });
// });

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});
