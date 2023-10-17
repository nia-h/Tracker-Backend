require('dotenv').config();
const express = require('express');
const path = require('path');
// const logger = require('morgan');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT;
const app = express();
const myRouter = require('./myRouter');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(cors());

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

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});
