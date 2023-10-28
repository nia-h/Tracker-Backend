require('dotenv').config();
const express = require('express');
const path = require('path');
// const logger = require('morgan');
// const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT;
const app = express();
const myRouter = require('./myRouter');
// const bodyParser = require('body-parser');

// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(cors());

// Mongo Connection
mongoose
  .connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Meds-Tracker',
  })
  .then(() => {
    console.log('Connected to Mongo!');
  })
  .catch(err => {
    console.error('Error connecting to Mongo', err);
  });

app.use('/', myRouter);

app.use((req, res) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };

  const errorObj = Object.assign(defaultErr, err);

  return res.status(errorObj.status).json(errorObj.message);
});

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
