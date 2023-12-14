const { User } = require("../models/models");
const { SocialUser } = require("../models/models");

const jwt = require("jsonwebtoken");

// // how long a token lasts before expiring
const tokenLasts = "1d";

const bcrypt = require("bcrypt");

const userController = {};

userController.register = async (req, res, next) => {
  console.log("hit register controller");
  if (res.locals.user) return next();
  let socialId = req.params.socialId;
  console.log("socialId form regisgter middleware==>", socialId);

  if (socialId) {
    //social user
    try {
      const user = await new SocialUser({ socialId }).save();

      res.locals.user = user;
      return next();
    } catch (e) {
      console.log(e);
    }
  } else {
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
  }
};

userController.socialUserLogin = async (req, res, next) => {
  const socialId = req.params.socialId;
  console.log("socialId==>", socialId);
  try {
    const user = await SocialUser.findOne({ socialId });
    if (user) {
      res.locals.user = user;
    }
    return next();
  } catch (e) {
    return next(e);
  }
};

userController.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      res.locals = {
        token: jwt.sign({ _id: user._id, email: user.email }, process.env.JWTSECRET, { expiresIn: tokenLasts }),
        userId: user._id,
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
