const { User } = require('../models/User');
// const Post = require("../models/Post")
// const Follow = require("../models/Follow")
const jwt = require('jsonwebtoken');

// // how long a token lasts before expiring
const tokenLasts = '365d';

const bcrypt = require('bcrypt');

const userController = {};
userController.register = async (req, res) => {
  const { email, password } = req.body;
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

// exports.apiGetHomeFeed = async function (req, res) {
//   try {
//     let posts = await Post.getFeed(req.apiUser._id)
//     res.json(posts)
//   } catch (e) {
//     res.status(500).send("Error")
//   }
// }

// exports.ifUserExists = function (req, res, next) {
//   User.findByUsername(req.params.username)
//     .then(function (userDocument) {
//       req.profileUser = userDocument
//       next()
//     })
//     .catch(function (e) {
//       res.json(false)
//     })
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
