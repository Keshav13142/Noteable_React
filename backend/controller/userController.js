const bcrypt = require("bcrypt");
const { User, Session } = require("../models/models");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    res.status(401);
    throw new Error("Please enter all the details!");
  } else {
    if (await User.findOne({ email })) {
      res.status(401);
      throw new Error("Try logging in if you already have an account");
    } else {
      const hashPass = await bcrypt.hash(password, 10);
      const user = await User.create({
        name: name,
        email: email,
        password: hashPass,
      });
      res.status(200).json({
        name: user.name,
        token: genereateToken(user._id),
      });
    }
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401);
    throw new Error("Please check you email and password!");
  } else {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        name: user.name,
        token: genereateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Please check you email and password!");
    }
  }
});

const logout = asyncHandler(async (req, res) => {
  const user = req.user;
  await Session.deleteOne({ user_id: user._id });
  res.status(200).json({
    message: "Successfully logged out",
  });
});

const genereateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
  Session.create({
    user_id: id,
    token: token,
  });
  return token;
};

module.exports = { register, login, logout };
