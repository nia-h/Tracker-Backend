const Axios = require('axios');

const medsBase = 'https://clinicaltables.nlm.nih.gov';

const medsController = {};

medsController.medsLookup = async (req, res, next) => {
  console.log('reached medsLookup middlewear');
  const { medsName } = req.body;
  // console.log('medsName==>', req.body);
  const url =
    medsBase + `/api/rxterms/v3/search?terms=${medsName}&ef=STRENGTHS_AND_FORMS`;

  try {
    const { data } = await Axios.get(url);
    res.locals.meds = data;
    return next();
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = medsController;
