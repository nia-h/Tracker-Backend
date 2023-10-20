const express = require('express');
const myRouter = express.Router();

const { User } = require('./models/models');
const medsController = require('./controllers/medsController.js');
const userController = require('./controllers/userController');
// const signupController = require('../controllers/signupController');
// const loginController = require('../controllers/loginController');
// const cookieController = require('../controllers/cookieController');

// router.post(
//   '/signup',
//   signupController.signUp,
//   cookieControlle.setCookie,
//   (req, res) => {
//     res.status(201).send({ message: 'User created successfully' });
//   }
// );

myRouter.get('/', (req, res) =>
  res
    .status(201)
    .json(
      "Hello, if you see this message that means your backend is up and running successfully. Congrats! Now let's continue learning React!"
    )
);

// myRouter.post('/meds-lookup', medsController.medsLookup, (req, res) => {
//   const { med } = res.locals;
//   console.log('med==>', med);
//   res.json(med);
// });

myRouter.post('/create-entry', medsController.createEntry, (req, res) => {
  const data = res.locals;
  //console.log('med==>', med);
  res.json(data);
});

myRouter.post('/register', userController.register, (req, res) => {
  const data = res.locals;
  //console.log('med==>', med);
  res.json(data);
});

// myRouter.post('/login', userController.login, (req, res) => {
//   const user = res.locals;
//   //console.log('med==>', med);
//   res.json(user);
// });

myRouter.get('/login', userController.login, (req, res) => {
  const user = res.locals;
  //console.log('med==>', med);
  res.json(user);
});

myRouter.get('/:email/medlist', medsController.getMedListByEmail, (req, res) => {
  const data = res.locals;
  //console.log('med==>', med);
  res.json(data);
});

// router.post( )
// router.post(
//   '/login',
//   loginController.loginUser,
//   cookieController.setCookie,
//   (req, res) => {
//     res.status(201).json(res.locals);
//   }
// );

// router.get('/auth', cookieController.verifyCookie, (req, res) =>
//   res.status(200).json(res.locals)
// );

// router.get('/logout', cookieController.logout, (req, res) => res.sendStatus(200));

module.exports = myRouter;
