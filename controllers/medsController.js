const Axios = require('axios');

const medsBase = 'https://clinicaltables.nlm.nih.gov';

const { EntryInfo } = require('../models/User');

const medsController = {};

medsController.createEntry = async (req, res, next) => {
  const entryInfo = req.body;
  // console.log('entryInfo==>', entryInfo);
  //res.json('this is a test');
  // const url =
  //   medsBase + `/api/rxterms/v3/search?terms=${medName}&ef=STRENGTHS_AND_FORMS`;

  try {
    const entry = await new EntryInfo(entryInfo).save();
    console.log('new entry==>', entry);
    res.locals = entry;
    return next();
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = medsController;
