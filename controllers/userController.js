const { User } = require('../models/models');
// const Post = require("../models/Post")
// const Follow = require("../models/Follow")
const jwt = require('jsonwebtoken');

// // how long a token lasts before expiring
const tokenLasts = '365d';

const bcrypt = require('bcrypt');

const userController = {};

// userController.test = a;

userController.register = async (req, res, next) => {
  console.log('reached register controller');

  let { email, password } = req.body;
  let salt = bcrypt.genSaltSync(10);
  password = bcrypt.hashSync(password, salt);
  try {
    const user = await new User({ email, password }).save();

    res.locals = user;
    return next();
  } catch (error) {
    res.status(500).send(error);
  }
};

userController.login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log('email==>', email);

  try {
    const user = await User.findOne({ email });
    console.log('retrieved user==>', user);
    if (user && bcrypt.compareSync(password, user.password)) {
      res.locals = {
        token: jwt.sign(
          { _id: user._id, email: user.email },
          process.env.JWTSECRET,
          { expiresIn: tokenLasts }
        ),
        email: user.email,
      };
      return next();
    } else {
      console.log('password issue');
    }
  } catch (e) {
    next(e);
  }
};

// }

// exports.profileBasicData = function (req, res) {
//   res.json({
//     profileUsername: req.profileUser.username,
//     profileAvatar: req.profileUser.avatar,
//     isFollowing: req.isFollowing,
//     counts: { postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount }
//   })
// }

module.exports = userController;
