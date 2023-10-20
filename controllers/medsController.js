const Axios = require('axios');

const { MedEntry } = require('../models/models');

const { User } = require('../models/models');

const medsController = {};

medsController.createEntry = async (req, res, next) => {
  const medEntry = req.body;
  console.log('MedEntry==>', medEntry);
  //res.json('this is a test');
  // const url =
  //   medsBase + `/api/rxterms/v3/search?terms=${medName}&ef=STRENGTHS_AND_FORMS`;

  try {
    const entry = await new MedEntry(medEntry).save();
    console.log('new entry==>', entry);
    res.locals = entry;
    return next();
  } catch (error) {}
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
