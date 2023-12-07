const { User } = require("../models/models");
// const Post = require("../models/Post")
// const Follow = require("../models/Follow")
const jwt = require("jsonwebtoken");

// // how long a token lasts before expiring
const tokenLasts = "365d";

const bcrypt = require("bcrypt");

const userController = {};

// userController.test = a;

userController.register = async (req, res, next) => {
  console.log("hit register controller");
  let { email, password } = req.body;
  let salt = bcrypt.genSaltSync(10);
  password = bcrypt.hashSync(password, salt);
  try {
    const user = await new User({ email, password }).save();

    res.locals = user;
    return next();
  } catch (e) {
    console.log(e);
  }
};

userController.login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("email==>", email);

  try {
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      res.locals = {
        token: jwt.sign({ _id: user._id, email: user.email }, process.env.JWTSECRET, { expiresIn: tokenLasts }),
        // email: user.email,
        userId: user._id,
        // profile: user,
      };
      return next();
    } else {
      return next({
        log: "userController.login ERROR",
        message: "userController.login ERROR: invalid email/password",
      });
    }
  } catch (e) {
    return next(e);
  }
};

module.exports = userController;
