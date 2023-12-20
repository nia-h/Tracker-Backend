const { User } = require("../models/models");

const jwt = require("jsonwebtoken");

// // how long a token lasts before expiring
const tokenLasts = "1d";

const bcrypt = require("bcrypt");

const userController = {};

userController.register = async (req, res, next) => {
  //need to add email already exists check

  let { email, password } = req.body;
  let salt = bcrypt.genSaltSync(10);
  password = bcrypt.hashSync(password, salt);
  try {
    const user = await new User({ email, password }).save();

    res.locals.user = user;
    return next();
  } catch (e) {
    console.log(e);
  }
};

userController.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && bcrypt.compareSync(password, user.password)) {
      res.locals = {
        token: jwt.sign({ id: user.id, email: user.email }, process.env.JWTSECRET, { expiresIn: tokenLasts }),
      };

      return next();
    } else {
      return next({
        log: "userController.login ERROR",
        message: "userController.login ERROR: invalid email/password",
      });
    }
  } catch (e) {
    console.log("error===>", e);
  }
};

module.exports = userController;
